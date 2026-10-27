const test = require('node:test');
const assert = require('node:assert/strict');
const { parseCSV, parseNumber, summarize, safeCSVCell } = require('../script.js');

test('sample values 1..5 have expected statistics and sample standard deviation', () => {
  assert.deepEqual(summarize([1, 2, 3, 4, 5]), { count: 5, mean: 3, max: 5, min: 1, median: 3, stddev: Math.sqrt(2.5) });
});

test('statistics ignore blanks and non-numeric values', () => {
  const result = summarize(['1', '', 'bad', '3']);
  assert.equal(result.count, 2); assert.equal(result.mean, 2); assert.equal(result.stddev, Math.sqrt(2));
});

test('one value has no sample standard deviation', () => {
  assert.deepEqual(summarize([42]), { count: 1, mean: 42, max: 42, min: 42, median: 42, stddev: null });
});

test('empty valid input has null metrics', () => {
  assert.deepEqual(summarize([]), { count: 0, mean: null, max: null, min: null, median: null, stddev: null });
});

test('CSV parser handles BOM, quoted commas, blank rows and missing cells', () => {
  const result = parseCSV('\uFEFFname,value,note\r\nA,1,"hello, world"\r\n\r\nB,,ok\r\n');
  assert.equal(result.rows.length, 2); assert.equal(result.rows[0][2], 'hello, world'); assert.equal(result.rows[1][1], '');
  assert.equal(result.columns[1].validCount, 1);
});

test('parser surfaces empty files, malformed quoting and absent numeric columns', () => {
  assert.throws(() => parseCSV('  '), /文件为空/);
  assert.throws(() => parseCSV('a,b\n1,"broken'), /未闭合/);
  assert.throws(() => parseCSV('name,note\na,hello'), /没有检测到有效数值列/);
});

test('numeric parser handles comma grouping and rejects infinities', () => {
  assert.equal(parseNumber('1,200.5'), 1200.5); assert.equal(parseNumber('Infinity'), null); assert.equal(parseNumber(''), null);
});

test('CSV export cell quotes content and neutralizes formula prefixes', () => {
  assert.equal(safeCSVCell('=1+1'), '"\'=1+1"'); assert.equal(safeCSVCell('hello,"world"'), '"hello,""world"""');
});
