<div align="center">

# ◈ DataLens

### 实验数据可视化分析工具

面向大学实验场景的轻量级 CSV 数据分析工作台

[English](README.en.md)

<br>

![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-f0db4f?style=flat-square&logo=javascript&logoColor=222)
![Chart.js](https://img.shields.io/badge/Charts-Chart.js-ff6384?style=flat-square&logo=chartdotjs&logoColor=fff)
![本地处理](https://img.shields.io/badge/数据-本地处理-2e9d78?style=flat-square)
![MIT License](https://img.shields.io/badge/License-MIT-3866ee?style=flat-square)

</div>

---

> 让实验数据更清晰，让分析过程更直接。

DataLens 使用原生 HTML、CSS 和 JavaScript 构建，在浏览器本地解析 CSV、计算统计指标、绘制交互图表、展示数据明细并导出结果。

项目无需账号、后端服务或数据库。上传的数据在当前浏览器中处理，不会由 DataLens 主动上传。

## 项目预览

<!-- 将真实截图上传至 docs/screenshot.png 后，此处会显示截图 -->
<div align="center">
  <img src="docs/screenshot.png" alt="DataLens 数据分析工作台截图" width="900">
  <br>
  <sub>DataLens 工作台 · 示例数据视图</sub>
</div>

## 功能一览

| 功能 | 说明 |
|:---|:---|
| CSV 导入 | 选择或拖放文件，支持 UTF-8 与 UTF-8 BOM |
| 示例数据 | 一键加载模拟电路实验数据 |
| 统计分析 | 计算有效数据数量、平均值、最大值、最小值、中位数和样本标准差 |
| 交互图表 | 切换折线图或柱状图，分别选择横坐标与纵坐标 |
| 数据明细 | 分页查看记录，每页 10 行 |
| CSV 导出 | 导出完整数据或统计摘要 |
| 隐私保护 | 数据在浏览器本地处理，不由项目上传 |
| 错误提示 | CSV 无效或图表库加载失败时显示相应提示 |

## 快速运行

需要 Node.js 18 或更新版本。

在项目目录打开终端，运行：

```bash
node server.js
浏览器访问：
http://127.0.0.1:4173
停止服务时，在终端按 Ctrl+C。
运行测试
node --test tests/core.test.js
如果已安装 npm，也可以运行：
npm test
详细测试记录见 [`tests.md`](tests.md)。
使用流程
01　打开 DataLens 页面
02　加载示例数据，或选择/拖放 CSV 文件
03　在数值列面板中选择分析列
04　选择图表横纵坐标，切换图表类型
05　查看并翻页浏览数据明细
06　导出数据或统计摘要  
CSV 文件格式
首行为字段名，后续每行是一条实验记录。字段使用逗号分隔。
实验序号,时间 (s),电压 (V),备注
1,0.0,0.12,启动
2,0.5,0.48,
3,1.0,0.91,稳定
含逗号或换行的字段应使用双引号包裹；字段内部的双引号需写成两个双引号。文件需要至少包含表头、数据行，以及至少一列有效数值。
统计口径
指标	说明
有效数据数量	可解析为有限数字的非空单元格数量
平均值	有效数值之和除以有效数值数量
最大值与最小值	有效数值中的最大和最小观测值
中位数	排序后的中间值；偶数个数据时取中间两值的平均数
样本标准差	分母使用 n − 1：s = √(Σ(xᵢ − x̄)² / (n − 1))


空值和无法解析为有限数字的内容不参与统计。有效值少于两个时，样本标准差显示为“—”；没有有效值时，对应指标也显示为“—”。
数据隐私
CSV 文件由浏览器 File API 在当前设备读取。项目没有接收 CSV 的后端服务，不会主动把用户数据保存或上传到云端。
Chart.js 和字体从第三方 CDN 加载静态资源。图表需要网络访问 Chart.js CDN；无法加载时，统计、表格和导出功能仍可使用。
当前限制
范围	当前情况
文件类型	支持逗号分隔的 CSV，不支持 Excel 工作簿
编码	以 UTF-8 和 UTF-8 BOM 为目标
分隔符	不自动识别分号或制表符
数值格式	支持普通十进制与千分位逗号，不解析附带单位的数字
大文件	浏览器内存和渲染速度会限制可处理规模
图表	依赖 CDN 加载 Chart.js；离线时其他分析功能仍可用


项目结构
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
后续方向
→　图表 PNG 导出与可打印报告
→　线性拟合、残差与测量不确定度分析
→　增加 CSV 编码和分隔符选项
→　使用 Web Worker 改进大文件处理
→　提供可完全离线使用的图表库版本  
开源许可
本项目采用 MIT License，详见 LICENSE。
<div align="center">
<sub>DataLens v1.0 · 为实验数据探索而做</sub>
</div>
```
