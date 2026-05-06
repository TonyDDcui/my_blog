# Lanqiao Dataset

本文定义蓝桥杯单片机组测试集的收集、整理、标注和评测规范。

## 数据来源

优先来源：

- 蓝桥杯官网 / 蓝桥云课历届真题
- 官网下载的单片机组省赛、国赛 `.doc` 或等价文档

非官方来源只能用于查漏补缺，不作为最终可信题源。

## 目录建议

题目原始文件不建议提交到公开仓库，建议放在本地或服务器私有目录：

```text
/opt/cuizhexiao/datasets/lanqiao/
  raw/
    provincial/
    national/
  extracted/
  annotations/
```

仓库只保留格式说明和清单模板。

## 文件命名

```text
lanqiao_mcu_<year>_<level>_<round>.<ext>
```

示例：

```text
lanqiao_mcu_2024_provincial_a.doc
lanqiao_mcu_2024_national_a.doc
```

字段含义：

- `year`：年份
- `level`：`provincial` 或 `national`
- `round`：同一年多场时使用 `a`、`b`、`c`
- `ext`：原始格式，第一版主要是 `.doc`

## 清单字段

每道题整理为一条记录：

| 字段 | 说明 |
| --- | --- |
| `id` | 唯一 ID |
| `contest` | 固定为 `lanqiao_mcu` |
| `year` | 年份 |
| `level` | `provincial` 或 `national` |
| `title` | 题目标题 |
| `source_url` | 官网或可信来源链接 |
| `source_file` | 原始 `.doc` 文件名 |
| `source_format` | `doc` |
| `mcu_family` | 通常为蓝桥杯单片机组默认硬件，后续可映射到 STM32 训练 |
| `peripherals` | 外设列表 |
| `difficulty` | `easy`、`medium`、`hard` |
| `expected_capabilities` | 需要 AI 覆盖的能力点 |

## 能力点标签

第一版重点标注这些标签：

- `timer`
- `gpio`
- `key_scan`
- `led`
- `segment_display`
- `lcd`
- `uart`
- `adc`
- `pwm`
- `eeprom`
- `i2c`
- `spi`
- `ds18b20`
- `ultrasonic`
- `relay`
- `buzzer`
- `state_machine`

## 文本提取流程

1. 下载 `.doc` 原始题目。
2. 转成 `.txt` 或 `.md`。
3. 人工检查格式，修正乱码、表格、图片说明。
4. 提取题目目标、硬件资源、功能要求、评分点。
5. 填入清单模板。
6. 用题目文本调用 AI。
7. 保存 AI 结构化输出。
8. 按评分表打分。

## 评分表

| 维度 | 分值 | 判断标准 |
| --- | --- | --- |
| 可落地性 | 20 | 方案是否能指导真实开发 |
| 硬件完整性 | 15 | 是否覆盖主控、传感器、显示、供电、通信 |
| 接线正确性 | 15 | 引脚和电路说明是否合理 |
| 代码可用性 | 25 | 是否能作为标准库/Arduino/SDK 示例 |
| 调试价值 | 15 | 是否给出可执行排查步骤 |
| 教学清晰度 | 10 | 教学模式是否适合初学者 |

满分 100，MVP 达标线建议为 70。

## 初始测试集目标

MVP 阶段建议先整理：

- 5 道省赛题
- 3 道国赛题
- 2 道自定义训练题

先覆盖常见外设：按键、LED、数码管、定时器、串口、ADC、PWM、EEPROM。

## 导入后的验收

- 每道题都有原始来源和结构化文本。
- 每道题至少标注 3 个能力点。
- AI 能生成硬件方案、淘宝搜索链接、接线说明、代码和调试步骤。
- 至少 3 道题的输出经过人工评分。
