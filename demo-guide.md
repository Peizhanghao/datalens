# DataLens 两分钟演示方案

## 演示流程（约 2 分钟）

1. **开场（0:00–0:15）**：介绍 DataLens 是纯浏览器本地处理的实验数据分析工具，强调无需注册，CSV 不上传。
2. **载入数据（0:15–0:30）**：点击“加载示例数据”，展示电路实验的时间、电压、电流三列，以及读取行数提示。
3. **统计分析（0:30–0:55）**：在“数值列”中切换电压与电流，指出数量、均值、中位数和样本标准差卡片随选择更新。
4. **探索图表（0:55–1:20）**：X 轴设为时间，Y 轴设为电压；悬停查看数据点，再切换柱状图并改变 Y 轴为电流。
5. **检查明细（1:20–1:38）**：展示表格、空值显示与分页控件，说明表格按每页 10 行呈现。
6. **导出与收尾（1:38–2:00）**：分别导出明细 CSV 和统计摘要，说明使用样本标准差，所有计算都在本地完成。

## 演示前准备

- 运行 `npm start` 并打开 `http://127.0.0.1:4173`。
- 若需要展示图表，预先确保网络可加载 Chart.js CDN。
- 浏览器下载目录保持可访问，以便展示导出文件。

## GitHub 项目首页介绍

DataLens 是一款面向大学实验场景的轻量级 CSV 数据分析与可视化工具。使用原生 HTML、CSS 和 JavaScript 构建，在浏览器本地完成数据解析、统计计算、交互式趋势图、分页查看与 CSV 导出。无需账号或后端，适合快速整理和探索物理、电路及数学实验数据。

## English project introduction

DataLens is a lightweight, browser-based CSV analysis and visualization tool for student lab work. Built with vanilla HTML, CSS, and JavaScript, it computes descriptive statistics, renders interactive charts, paginates raw data, and exports CSV summaries locally—without accounts, a backend, or cloud storage.
