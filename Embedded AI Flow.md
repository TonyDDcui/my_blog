# Embedded AI Flow

本文定义嵌入式 AI 助手的核心输入输出协议，覆盖硬件方案、淘宝搜索链接、接线说明、代码生成和调试建议。

## 1. 产品目标

用户用自然语言描述项目需求，系统输出可落地的嵌入式项目方案。

第一版重点不是泛聊天，而是稳定地产生结构化结果：

- 需求拆解
- 硬件清单
- 淘宝搜索链接
- 接线说明
- 电路注意事项
- 示例代码
- 调试步骤
- 风险提示

## 2. 输入协议

接口：

```http
POST /api/ai/embedded/project-plan
```

请求体：

```json
{
  "message": "我想做一个蓝桥杯单片机训练题，需要测温并显示到数码管，教我怎么做",
  "mode": "auto",
  "scenario": "auto",
  "mcu_family": "auto",
  "constraints": {
    "budget_cny": 100,
    "skill_level": "beginner",
    "already_have": ["开发板", "杜邦线"],
    "prefer_code_style": "standard_peripheral_library"
  }
}
```

## 3. 模式判断

`mode=auto` 时，由服务端判断：

| 用户表达 | 模式 | 输出风格 |
| --- | --- | --- |
| 教我、讲一下、我不会、为什么 | `teaching` | 分步骤讲解，解释原因，适合初学者 |
| 直接给方案、我要结果、帮我落地 | `delivery` | 少解释，直接给硬件、接线、代码和调试 |
| 无明显倾向 | `delivery` | MVP 默认偏落地 |

## 4. 场景识别

| 场景 | 触发关键词 |
| --- | --- |
| `lanqiao_mcu` | 蓝桥杯、单片机组、省赛、国赛、数码管、IAP15、官方开发板 |
| `electronic_design` | 电赛、电子设计竞赛、控制题、电源题、仪器题 |
| `smart_car` | 智能车、循迹、摄像头、编码器、电机、PID |
| `general` | 其他嵌入式项目 |

## 5. 主控识别

| 主控 | 第一版代码生态 |
| --- | --- |
| `STM32` | 标准库 |
| `ESP32` | Arduino for ESP32 |
| `NXP_RT1064` | MCUXpresso SDK |

如果用户未指定，蓝桥杯单片机组默认优先映射到 STM32 训练输出，但需要保留原题硬件差异说明。

## 6. 淘宝搜索链接生成

第一版不维护固定商品库，由 AI 或服务端根据硬件名称生成淘宝搜索链接。

规则：

1. 每个硬件项生成一个中文搜索关键词。
2. 关键词包含核心型号和用途，例如 `STM32F103C8T6 开发板`。
3. URL 使用淘宝搜索格式：

```text
https://s.taobao.com/search?q=<url_encoded_keyword>
```

示例：

```json
{
  "name": "STM32F103C8T6 最小系统板",
  "reason": "适合 STM32 标准库入门和蓝桥杯训练迁移",
  "taobao_keyword": "STM32F103C8T6 最小系统板",
  "taobao_search_url": "https://s.taobao.com/search?q=STM32F103C8T6%20%E6%9C%80%E5%B0%8F%E7%B3%BB%E7%BB%9F%E6%9D%BF"
}
```

## 7. 输出协议

响应体：

```json
{
  "mode": "teaching",
  "scenario": "lanqiao_mcu",
  "mcu_family": "STM32",
  "code_style": "standard_peripheral_library",
  "summary": "使用 STM32 完成温度采集并在数码管显示。",
  "requirement_breakdown": [
    "读取温度传感器数据",
    "定时刷新数码管",
    "按键切换显示模式"
  ],
  "hardware_plan": [
    {
      "name": "STM32F103C8T6 最小系统板",
      "category": "mcu",
      "required": true,
      "reason": "适合标准库示例和外设训练"
    }
  ],
  "purchase_links": [
    {
      "source": "taobao",
      "keyword": "STM32F103C8T6 最小系统板",
      "url": "https://s.taobao.com/search?q=STM32F103C8T6%20%E6%9C%80%E5%B0%8F%E7%B3%BB%E7%BB%9F%E6%9D%BF"
    }
  ],
  "wiring_plan": [
    {
      "module": "DS18B20",
      "module_pin": "DQ",
      "mcu_pin": "PB12",
      "note": "DQ 需要上拉电阻"
    }
  ],
  "circuit_notes": [
    "注意 3.3V 和 5V 模块电平兼容",
    "传感器数据线建议加上拉电阻"
  ],
  "code": [
    {
      "filename": "main.c",
      "language": "c",
      "description": "主循环和初始化骨架",
      "content": "int main(void) { /* ... */ }"
    }
  ],
  "debug_steps": [
    "先单独点亮 LED，确认 GPIO 正常",
    "再调试数码管动态扫描",
    "最后接入温度传感器"
  ],
  "risks": [
    "不同开发板引脚可能不同，需要按原理图调整"
  ]
}
```

## 8. 代码输出要求

### STM32 标准库

- 使用 `stm32f10x.h`
- 明确 RCC、GPIO、NVIC、TIM 等初始化步骤
- 外设驱动分文件输出，例如 `bsp_led.c`、`bsp_key.c`
- 不承诺完整 Keil 工程，但必须给出可迁移代码骨架

### ESP32 Arduino

- 使用 `setup()` 和 `loop()`
- 优先给出 Arduino IDE / PlatformIO 都能理解的示例
- Wi-Fi、串口、传感器库需要说明安装方式

### NXP RT1064 MCUXpresso SDK

- 使用 SDK 风格初始化
- 说明 board、pin_mux、clock_config 的依赖
- 示例代码聚焦核心逻辑，避免伪造完整 SDK 工程

## 9. 错误处理

| 错误码 | 场景 |
| --- | --- |
| `UNAUTHENTICATED` | 未登录 |
| `SUBSCRIPTION_REQUIRED` | 超出免费次数 |
| `UNSUPPORTED_MCU` | 主控不在第一版范围 |
| `MODEL_UNAVAILABLE` | 模型服务不可用 |
| `INVALID_OUTPUT` | 模型输出无法解析 |

## 10. 质量约束

- 不能只输出“建议查资料”。
- 接线说明必须包含模块引脚和主控引脚。
- 购买链接必须是淘宝搜索链接，不承诺具体商品。
- 代码必须标明目标生态：标准库、Arduino for ESP32 或 MCUXpresso SDK。
- 调试步骤必须按“最小硬件验证 -> 外设验证 -> 系统联调”排序。
