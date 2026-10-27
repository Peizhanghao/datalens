[README.md.txt](https://github.com/user-attachments/files/34026634/README.md.txt)
# DataLens — 实验数据可视化分析工具

**DataLens** 是一款面向大学实验场景的轻量级 CSV 数据分析与可视化工具。它使用原生 HTML、CSS 和 JavaScript 构建，在浏览器本地完成 CSV 解析、统计计算、交互式图表、数据明细查看和 CSV 导出。

项目无需账号、后端服务或数据库。用户上传的数据由浏览器在本地读取和处理，不会由 DataLens 主动上传。

> [English version](#english)

## 功能

- **CSV 导入：**通过文件选择或拖放导入 CSV，支持 UTF-8 和 UTF-8 BOM。
- **示例数据：**一键加载模拟电路实验数据，无需提前准备文件。
- **统计摘要：**查看有效数据数量、平均值、最大值、最小值、中位数和样本标准差。
- **交互式图表：**选择横坐标与纵坐标，切换折线图或柱状图，并悬停查看数据点。
- **数据明细：**分页查看导入记录，每页显示 10 行。
- **CSV 导出：**分别导出完整数据和统计摘要，文件使用 UTF-8 BOM。
- **公式注入防护：**导出时处理以公式字符开头的单元格。
- **本地处理：**CSV 解析、统计和导出在浏览器本地完成。
- **图表备用提示：**Chart.js CDN 无法加载时会显示提示；统计、表格和导出仍可使用。

## 技术栈

HTML5、CSS3、原生 JavaScript、浏览器 File API、Chart.js 4（CDN）、Node.js 内置 HTTP 服务和测试运行器。项目没有第三方 npm 运行时依赖。

## 项目结构

```text
.
├── index.html
├── styles.css
├── script.js
├── sample-data.csv
├── server.js
├── package.json
├── README.md
├── LICENSE
├── .gitignore
├── tests.md
├── demo-guide.md
├── portfolio.md
└── tests/
    └── core.test.js
本地运行
需要 Node.js 18 或更新版本。在项目目录打开终端并运行：
node server.js
然后浏览器访问：
http://127.0.0.1:4173
停止服务器时，在终端按 Ctrl+C。也可以使用其他静态文件服务器，将项目根目录设为网站根目录。
运行测试
node --test tests/core.test.js
如果已安装 npm，也可以运行：
npm test
使用方法
1. 打开 DataLens 页面。
2. 点击“加载示例数据”，或选择/拖放一个 CSV 文件。
3. 在“数值列”面板中选择要统计的列。
4. 选择图表横轴和纵轴，并切换折线图或柱状图。
5. 在数据明细区域查看记录并翻页。
6. 导出完整数据 CSV 或统计摘要 CSV。
CSV 数据格式
CSV 第一行是表头，后续每行为一条记录，字段以逗号分隔。
实验序号,时间 (s),电压 (V),备注
1,0.0,0.12,启动
2,0.5,0.48,
3,1.0,0.91,稳定
含逗号或换行的字段应使用双引号包裹；字段内部的双引号需写成两个双引号。文件至少要有表头、数据行，并且至少有一列包含有效数值。
统计口径
- **有效数据数量：**可解析为有限数字的非空单元格数量。
- **平均值：**有效数值之和除以有效数值数量。
- **最大值、最小值：**有效数值中的最大和最小观测值。
- **中位数：**排序后的中间值；偶数个数据时取中间两值的平均数。
- **样本标准差：**分母使用 n − 1：
  s = √(Σ(xᵢ − x̄)² / (n − 1))
- 空单元格和无法解析为有限数字的内容不会进入统计。
- 有效值少于两个时，样本标准差显示为“—”；无有效值时，相应统计项也显示为“—”。
数据隐私
浏览器通过 File API 在当前设备读取 CSV。项目没有接收 CSV 的后端，不会主动把数据保存或上传到云端。
Chart.js 和 Google Fonts 从第三方 CDN 加载静态资源。CSV 文件内容不会由 DataLens 上传给这些 CDN。绘图需要浏览器能够访问 Chart.js CDN；CDN 不可用时，统计、表格和导出仍可使用。
当前限制
- 当前支持逗号分隔的 CSV，不自动识别分号或制表符分隔文件。
- 目标编码为 UTF-8 和 UTF-8 BOM；其他编码需要先转换为 UTF-8。
- 不支持 Excel .xlsx 工作簿。
- 数值解析支持普通十进制和千分位逗号，不解析附带单位的数值或本地化小数逗号。
- 数据保存在浏览器内存中；超大文件可能受设备内存和渲染速度影响。
- 图表依赖网络加载 Chart.js CDN；离线时统计、表格和导出仍可用。
测试状态
项目核心逻辑有 Node.js 自动化测试，覆盖统计计算、边界情况、CSV 解析和导出安全处理。浏览器中的文件选择、拖放、真实文件下载、图表交互和手机端视觉布局需要另外手工检查。具体记录见 [tests.md](tests.md)。
许可
本项目使用 MIT License，详见 LICENSE。

English
DataLens is a lightweight CSV analysis and visualization tool for university lab work. Built with vanilla HTML, CSS, and JavaScript, it parses CSV files, computes descriptive statistics, renders interactive charts, displays paginated records, and exports CSV results in the browser.
No account, backend, or database is required. CSV data is processed locally by the browser and is not uploaded by DataLens.
Features
- Import CSV files using the file picker or drag and drop; UTF-8 and UTF-8 BOM are supported.
- Load the built-in simulated circuit experiment sample.
- Calculate valid-value count, mean, maximum, minimum, median, and sample standard deviation.
- Explore line and bar charts with selectable X and Y columns.
- Browse records in pages of 10 rows.
- Export raw data and statistical summaries as UTF-8 CSV files.
- Neutralize formula prefixes in exported cells.
- Continue using statistics, tables, and exports if the Chart.js CDN is unavailable.
Technology
HTML5, CSS3, vanilla JavaScript, the browser File API, Chart.js 4 via CDN, and Node.js built-in HTTP and test modules. No third-party npm runtime dependencies are required.
Run locally
Install Node.js 18 or later. From the project directory, run:
node server.js
Open http://127.0.0.1:4173 in your browser.
Run core tests with:
node --test tests/core.test.js
Statistics
Blank cells and values that cannot be parsed as finite numbers are excluded. Sample standard deviation uses the denominator n − 1. It is shown as — when fewer than two valid values are available.
Privacy and limitations
CSV parsing, statistics, and exports run in the browser. The project does not provide a backend or upload endpoint. Chart.js and Google Fonts are loaded from CDNs; charts require access to the Chart.js CDN, while data analysis remains available if it cannot load.
The current version targets comma-separated UTF-8 CSV files. It does not import Excel workbooks or automatically detect alternate delimiters. Large files may be limited by browser memory and rendering performance. See the sections above and tests.md for details.
License
Released under the MIT License. See LICENSE.
