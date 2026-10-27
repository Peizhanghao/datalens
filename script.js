/* DataLens: CSV parsing, summary statistics, and view updates stay in the browser. */
(function () {
  'use strict';

  const COLORS = ['#3866ee', '#26a981', '#f0a84a', '#9b74db', '#e36c77', '#45a8c4'];
  const PAGE_SIZE = 10;
  const $ = (id) => document.getElementById(id);
  const state = { dataset: null, analysisColumn: null, xColumn: null, yColumn: null, chartType: 'line', page: 0, chart: null };

  /** Parse CSV with quoted fields and escaped quotes, rejecting malformed quoting. */
  function parseCSV(source) {
    const text = String(source).replace(/^\uFEFF/, '');
    if (!text.trim()) throw new Error('文件为空，请选择包含表头和数据的 CSV 文件。');
    const rows = [];
    let row = [], field = '', quoted = false, closedQuote = false;
    for (let i = 0; i < text.length; i += 1) {
      const ch = text[i];
      if (quoted) {
        if (ch === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
        else if (ch === '"') { quoted = false; closedQuote = true; }
        else field += ch;
      } else if (ch === '"') {
        if (field.length || closedQuote) throw new Error('CSV 格式错误：引号只能出现在字段开头。');
        quoted = true;
      } else if (ch === ',') {
        row.push(field); field = ''; closedQuote = false;
      } else if (ch === '\n' || ch === '\r') {
        row.push(field); field = ''; closedQuote = false;
        if (row.some((value) => value.trim() !== '')) rows.push(row);
        row = [];
        if (ch === '\r' && text[i + 1] === '\n') i += 1;
      } else {
        if (closedQuote && ch.trim()) throw new Error('CSV 格式错误：结束引号后存在多余内容。');
        field += ch;
      }
    }
    if (quoted) throw new Error('CSV 格式错误：存在未闭合的双引号。');
    row.push(field);
    if (row.some((value) => value.trim() !== '')) rows.push(row);
    if (rows.length < 2) throw new Error('CSV 文件需至少包含一行表头和一行数据。');

    const rawHeaders = rows[0].map((header, index) => header.trim() || `未命名列 ${index + 1}`);
    const headers = rawHeaders.map((header, index) => rawHeaders.indexOf(header) === index ? header : `${header} (${index + 1})`);
    const dataRows = rows.slice(1).map((cells) => headers.map((_, index) => (cells[index] || '').trim()));
    const columns = headers.map((name, index) => {
      const values = dataRows.map((r) => r[index]);
      const numeric = values.map(parseNumber).filter((value) => value !== null);
      return { name, index, numeric, validCount: numeric.length, isNumeric: numeric.length > 0 };
    });
    if (!columns.some((column) => column.isNumeric)) throw new Error('没有检测到有效数值列。请确保至少一列包含数字数据。');
    return { headers, rows: dataRows, columns };
  }

  function parseNumber(value) {
    if (value === null || value === undefined || String(value).trim() === '') return null;
    const normalized = String(value).trim().replace(/,/g, '');
    const number = Number(normalized);
    return Number.isFinite(number) ? number : null;
  }

  /** Sample standard deviation (n - 1); null when fewer than two values exist. */
  function summarize(input) {
    const values = input.map((value) => typeof value === 'number' ? value : parseNumber(value)).filter((value) => value !== null);
    if (!values.length) return { count: 0, mean: null, max: null, min: null, median: null, stddev: null };
    const sorted = [...values].sort((a, b) => a - b);
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const middle = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
    const variance = values.length > 1 ? values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1) : null;
    return { count: values.length, mean, max: sorted[sorted.length - 1], min: sorted[0], median, stddev: variance === null ? null : Math.sqrt(variance) };
  }

  function formatValue(value) {
    if (value === null || !Number.isFinite(value)) return '—';
    return new Intl.NumberFormat('zh-CN', { maximumSignificantDigits: 7 }).format(value);
  }

  function showNotice(message, kind) {
    const notice = $('notice');
    notice.textContent = message;
    notice.className = `notice ${kind}`;
    notice.hidden = false;
  }

  function clearNotice() { $('notice').hidden = true; }

  function setDataset(dataset, fileName) {
    state.dataset = dataset;
    const firstNumeric = dataset.columns.find((column) => column.isNumeric);
    state.analysisColumn = firstNumeric.name;
    state.yColumn = firstNumeric.name;
    state.xColumn = dataset.columns.find((column) => column.name !== firstNumeric.name)?.name || firstNumeric.name;
    state.page = 0;
    $('empty-state').hidden = true;
    $('workspace').hidden = false;
    $('dataset-name').textContent = fileName;
    $('dataset-name').title = fileName;
    $('dataset-caption').textContent = fileName;
    $('row-count').textContent = `${dataset.rows.length} 行`;
    clearNotice();
    renderAll();
  }

  function renderAll() {
    renderStats(); renderColumns(); renderSelectors(); renderChart(); renderTable();
  }

  function renderStats() {
    const column = state.dataset.columns.find((item) => item.name === state.analysisColumn);
    const summary = summarize(column ? column.numeric : []);
    const values = [
      ['有效数据', summary.count, '个有效数值'], ['平均值', summary.mean, state.analysisColumn],
      ['最大值', summary.max, '观測上限'], ['最小值', summary.min, '觀測下限'],
      ['中位数', summary.median, '数据中点'], ['样本标准差', summary.stddev, 'n − 1']
    ];
    $('stats-grid').innerHTML = values.map(([label, value, caption]) => `<article class="stat-card"><div class="stat-label">${label}</div><div class="stat-value">${typeof value === 'number' ? escapeHTML(formatValue(value)) : '—'}${label === '有效数据' ? '<span class="stat-unit">个</span>' : ''}</div><div class="stat-caption">${escapeHTML(caption)}</div></article>`).join('');
  }

  function renderColumns() {
    const numericColumns = state.dataset.columns.filter((column) => column.isNumeric);
    $('column-count').textContent = String(numericColumns.length);
    $('column-list').innerHTML = numericColumns.map((column, index) => `<button class="column-item ${column.name === state.analysisColumn ? 'active' : ''}" data-column="${escapeAttribute(column.name)}"><span class="column-swatch" style="background:${column.name === state.analysisColumn ? COLORS[index % COLORS.length] : ''}"></span><span class="column-info"><span class="column-name">${escapeHTML(column.name)}</span><span class="column-meta">${column.validCount} / ${state.dataset.rows.length} 个有效值</span></span><span class="column-type">123</span></button>`).join('');
    $('column-list').querySelectorAll('[data-column]').forEach((button) => button.addEventListener('click', () => {
      state.analysisColumn = button.dataset.column;
      state.yColumn = button.dataset.column;
      renderStats(); renderColumns(); renderSelectors(); renderChart();
    }));
  }

  function renderSelectors() {
    const columns = state.dataset.columns;
    const options = columns.map((column) => `<option value="${escapeAttribute(column.name)}">${escapeHTML(column.name)}</option>`).join('');
    $('x-select').innerHTML = options; $('y-select').innerHTML = options;
    $('x-select').value = state.xColumn; $('y-select').value = state.yColumn;
    $('x-select').onchange = (event) => { state.xColumn = event.target.value; renderChart(); };
    $('y-select').onchange = (event) => { state.yColumn = event.target.value; state.analysisColumn = state.dataset.columns.find((column) => column.name === state.yColumn)?.isNumeric ? state.yColumn : state.analysisColumn; renderStats(); renderColumns(); renderChart(); };
  }

  function renderChart() {
    const fallback = $('chart-fallback'), empty = $('chart-empty'), canvas = $('data-chart');
    if (!window.Chart) { fallback.hidden = false; canvas.hidden = true; empty.hidden = true; return; }
    fallback.hidden = true; canvas.hidden = false;
    const xColumn = state.dataset.columns.find((column) => column.name === state.xColumn);
    const yColumn = state.dataset.columns.find((column) => column.name === state.yColumn);
    const points = state.dataset.rows.map((row) => ({ x: row[xColumn.index] || '(空值)', y: parseNumber(row[yColumn.index]) })).filter((point) => point.y !== null);
    $('chart-point-count').textContent = `${points.length} 个数据点`;
    $('chart-legend').textContent = yColumn.name;
    empty.hidden = points.length > 0;
    if (state.chart) state.chart.destroy();
    if (!points.length) { canvas.hidden = true; return; }
    state.chart = new Chart(canvas, {
      type: state.chartType,
      data: { labels: points.map((point) => point.x), datasets: [{ label: yColumn.name, data: points.map((point) => point.y), borderColor: COLORS[0], backgroundColor: state.chartType === 'bar' ? '#3866eeaa' : '#3866ee18', pointBackgroundColor: COLORS[0], pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: points.length > 150 ? 0 : 3, pointHoverRadius: 5, borderWidth: 2, tension: .32, fill: state.chartType === 'line', spanGaps: false }] },
      options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1c2b3e', padding: 10, titleFont: { family: 'DM Sans, sans-serif', size: 11 }, bodyFont: { family: 'DM Mono, monospace', size: 11 }, callbacks: { label: (context) => ` ${yColumn.name}: ${formatValue(context.parsed.y)}` } } }, scales: { x: { title: { display: true, text: xColumn.name, color: '#8793a3', font: { size: 10 } }, grid: { display: false }, ticks: { color: '#929eac', maxTicksLimit: 9, maxRotation: 0, font: { size: 9 } } }, y: { title: { display: true, text: yColumn.name, color: '#8793a3', font: { size: 10 } }, grid: { color: '#edf0f4' }, ticks: { color: '#929eac', maxTicksLimit: 6, font: { size: 9 } } } } }
    });
  }

  function renderTable() {
    const start = state.page * PAGE_SIZE;
    const pageRows = state.dataset.rows.slice(start, start + PAGE_SIZE);
    $('table-total').textContent = `(${state.dataset.rows.length})`;
    $('page-label').textContent = `第 ${state.page + 1} / ${Math.max(1, Math.ceil(state.dataset.rows.length / PAGE_SIZE))} 页`;
    $('showing-label').textContent = `显示 ${pageRows.length} 行，共 ${state.dataset.rows.length} 行`;
    $('data-table').querySelector('thead').innerHTML = `<tr>${state.dataset.headers.map((header) => `<th>${escapeHTML(header)}</th>`).join('')}</tr>`;
    $('data-table').querySelector('tbody').innerHTML = pageRows.map((row) => `<tr>${row.map((value) => `<td title="${escapeAttribute(value)}">${escapeHTML(value) || '<span style="color:#bec6d0">—</span>'}</td>`).join('')}</tr>`).join('');
    $('table-empty').hidden = state.dataset.rows.length > 0;
    $('prev-page').disabled = state.page === 0;
    $('next-page').disabled = start + PAGE_SIZE >= state.dataset.rows.length;
  }

  function escapeHTML(value) { return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
  function escapeAttribute(value) { return escapeHTML(value); }
  function safeCSVCell(value) {
    let text = String(value ?? '');
    if (/^[\s\uFEFF]*[=+@\-]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  }
  function downloadCSV(filename, rows) {
    const content = '\uFEFF' + rows.map((row) => row.map(safeCSVCell).join(',')).join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
    link.download = filename; link.click(); URL.revokeObjectURL(link.href);
  }

  function loadFile(file) {
    if (!file) return;
    if (!/\.csv$/i.test(file.name) && file.type !== 'text/csv') { showNotice('文件格式不受支持，请选择 CSV 文件。', 'error'); return; }
    if (file.size === 0) { showNotice('文件为空，请选择包含表头和数据的 CSV 文件。', 'error'); return; }
    const reader = new FileReader();
    reader.onload = () => { try { setDataset(parseCSV(reader.result), file.name); showNotice(`已成功读取 ${file.name}，共 ${state.dataset.rows.length} 行数据。`, 'success'); } catch (error) { showNotice(error.message, 'error'); } };
    reader.onerror = () => showNotice('文件读取失败，请重试或检查文件是否损坏。', 'error');
    reader.readAsText(file, 'UTF-8');
  }

  function loadSample() {
    const csv = '实验序号,时间 (s),电压 (V),电流 (mA),备注\n1,0.0,0.12,2.4,启动\n2,0.5,0.48,9.6,\n3,1.0,0.91,18.2,稳定\n4,1.5,1.37,27.4,\n5,2.0,1.82,36.4,\n6,2.5,2.31,46.2,\n7,3.0,2.75,55.0,采样\n8,3.5,3.19,63.8,\n9,4.0,3.68,73.6,\n10,4.5,4.10,82.0,\n11,5.0,4.58,91.6,\n12,5.5,5.02,100.4,结束';
    try { setDataset(parseCSV(csv), '示例数据 · 电路实验'); showNotice(`已加载电路实验示例数据，共 ${state.dataset.rows.length} 行。`, 'success'); } catch (error) { showNotice(error.message, 'error'); }
  }

  if (typeof document === 'undefined') {
    if (typeof module !== 'undefined' && module.exports) module.exports = { parseCSV, parseNumber, summarize, safeCSVCell };
    return;
  }

  $('choose-file').addEventListener('click', () => $('file-input').click());
  $('browse-file').addEventListener('click', () => $('file-input').click());
  $('file-input').addEventListener('change', (event) => { loadFile(event.target.files[0]); event.target.value = ''; });
  $('load-sample').addEventListener('click', loadSample);
  $('empty-sample').addEventListener('click', loadSample);
  const dropzone = $('dropzone');
  dropzone.addEventListener('click', (event) => { if (event.target === dropzone || event.target.closest('.upload-icon')) $('file-input').click(); });
  dropzone.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); $('file-input').click(); } });
  ['dragenter', 'dragover'].forEach((name) => dropzone.addEventListener(name, (event) => { event.preventDefault(); dropzone.classList.add('dragover'); }));
  ['dragleave', 'drop'].forEach((name) => dropzone.addEventListener(name, (event) => { event.preventDefault(); dropzone.classList.remove('dragover'); }));
  dropzone.addEventListener('drop', (event) => loadFile(event.dataTransfer.files[0]));
  $('prev-page').addEventListener('click', () => { if (state.page > 0) { state.page -= 1; renderTable(); } });
  $('next-page').addEventListener('click', () => { if (state.page * PAGE_SIZE + PAGE_SIZE < state.dataset.rows.length) { state.page += 1; renderTable(); } });
  document.querySelectorAll('[data-chart]').forEach((button) => button.addEventListener('click', () => {
    state.chartType = button.dataset.chart;
    document.querySelectorAll('[data-chart]').forEach((item) => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
    if (state.dataset) renderChart();
  }));
  $('export-data').addEventListener('click', () => {
    if (!state.dataset) return;
    downloadCSV(`DataLens-数据明细-${new Date().toISOString().slice(0, 10)}.csv`, [state.dataset.headers, ...state.dataset.rows]);
  });
  $('export-summary').addEventListener('click', () => {
    if (!state.dataset) return;
    const rows = [['分析列', '指标', '数值'], ...state.dataset.columns.filter((column) => column.isNumeric).flatMap((column) => { const result = summarize(column.numeric); return Object.entries({ '有效数据数量': result.count, '平均值': result.mean, '最大值': result.max, '最小值': result.min, '中位数': result.median, '样本标准差': result.stddev }).map(([metric, value]) => [column.name, metric, value ?? '']); })];
    downloadCSV(`DataLens-统计摘要-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  });

  // Export pure functions for Node's built-in test runner; browsers use the same implementation.
  if (typeof module !== 'undefined' && module.exports) module.exports = { parseCSV, parseNumber, summarize, safeCSVCell };
  if (window.chartLoadFailed) document.addEventListener('DOMContentLoaded', () => { if (state.dataset) renderChart(); });
}());
