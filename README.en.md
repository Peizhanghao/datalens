<div align="center">

# ◈ DataLens

### Lab Data Visualization & Analysis

A lightweight CSV analysis workspace for university lab experiments

[简体中文](README.md)

<br>

![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-f0db4f?style=flat-square&logo=javascript&logoColor=222)
![Chart.js](https://img.shields.io/badge/Charts-Chart.js-ff6384?style=flat-square&logo=chartdotjs&logoColor=fff)
![Local Processing](https://img.shields.io/badge/Data-Processed%20Locally-2e9d78?style=flat-square)
![MIT License](https://img.shields.io/badge/License-MIT-3866ee?style=flat-square)

</div>

---

> Clearer lab data. More direct analysis.

DataLens is built with vanilla HTML, CSS, and JavaScript. It parses CSV files, computes descriptive statistics, renders interactive charts, displays records, and exports results directly in the browser.

No account, backend, or database is required. Uploaded files are processed in the current browser and are not actively uploaded by DataLens.

## Preview

<!-- Upload a real screenshot to docs/screenshot.png to display it here -->
<div align="center">
  <img src="docs/screenshot.png" alt="DataLens analysis workspace screenshot" width="900">
  <br>
  <sub>DataLens workspace · Sample dataset view</sub>
</div>

## Features

| Feature | Description |
|:---|:---|
| CSV import | Select or drop files; UTF-8 and UTF-8 BOM are supported |
| Sample dataset | Load a simulated circuit experiment dataset |
| Statistics | Valid count, mean, maximum, minimum, median, and sample standard deviation |
| Interactive charts | Switch between line and bar charts; choose X and Y columns independently |
| Data table | Browse records in pages of 10 rows |
| CSV export | Export raw data or a statistical summary |
| Privacy | Data is processed locally in the browser |
| Error handling | Clear messages for invalid CSV files and unavailable chart resources |

## Quick start

Install Node.js 18 or later. From the project directory, run:

```bash
node server.js
Open the following address in your browser:
http://127.0.0.1:4173
Press Ctrl+C in the terminal to stop the server.
Tests
Run the core tests with Node.js:
node --test tests/core.test.js
If npm is available, you can also run:
npm test
See [`tests.md`](tests.md) for the detailed test record.
Workflow
01　Open the DataLens page
02　Load the sample data or select/drop a CSV file
03　Choose a numeric column to analyze
04　Select chart axes and chart type
05　Browse the paginated data table
06　Export raw data or the statistical summary  
CSV format
The first row contains column names. Each following row represents one observation. Fields are comma-separated.
Sample,Time (s),Voltage (V),Note
1,0.0,0.12,Start
2,0.5,0.48,
3,1.0,0.91,Stable
Fields containing commas or line breaks should be quoted. A quote inside a quoted field should be doubled. A file must contain a header, at least one data row, and at least one column with valid numeric values.
Statistics
Metric	Definition
Valid count	Number of non-empty cells parsed as finite numbers
Mean	Sum of valid values divided by their count
Maximum and minimum	Largest and smallest valid observations
Median	Middle value after sorting; the average of the two middle values for an even count
Sample standard deviation	Uses n − 1: s = √(Σ(xᵢ − x̄)² / (n − 1))


Blank cells and values that cannot be parsed as finite numbers are excluded. Sample standard deviation is shown as — when fewer than two valid values are available. Other metrics are shown as — when no valid values are available.
Privacy
CSV files are read by the browser File API and processed on the current device. The project has no CSV upload backend and does not actively store or upload user data to the cloud.
Chart.js and fonts are loaded as static resources from third-party CDNs. Charts require access to the Chart.js CDN. Statistics, the table, and exports remain available if it cannot be loaded.
Current limitations
Area	Current status
File type	Comma-separated CSV; Excel workbooks are not supported
Encoding	UTF-8 and UTF-8 BOM are targeted
Delimiters	Semicolons and tabs are not detected automatically
Numeric formats	Decimal numbers and comma grouping are supported; numbers with units are not parsed
Large files	Browser memory and rendering speed limit the practical size
Charts	Chart.js is loaded from a CDN; other analysis features remain available offline


Project structure
.
├── index.html
├── styles.css
├── script.js
├── sample-data.csv
├── server.js
├── package.json
├── README.md
├── README.en.md
├── LICENSE
├── tests.md
├── demo-guide.md
├── portfolio.md
└── tests/
    └── core.test.js
Future work
→　PNG chart export and printable reports
→　Linear fitting, residuals, and measurement uncertainty
→　More CSV encoding and delimiter options
→　Web Worker support for larger files
→　A fully offline chart library option  
License
This project is released under the MIT License. See LICENSE.
<div align="center">
<sub>DataLens v1.0 · Made for exploring experimental data</sub>
</div>
```
