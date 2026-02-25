---
title: "C 语言核心能力"
description: "掌握 Zephyr RTOS 开发所需的 C 语言核心知识，包括指针、结构体、位操作和嵌入式 C 特性"
tags: ["前置知识", "C 语言", "指针", "结构体", "位操作", "嵌入式"]
difficulty: "初级"
estimated_time: "1-2 周"
---

# C 语言核心能力

## 概述

C 语言是 Zephyr RTOS 开发的基础。本章节将帮助你掌握嵌入式系统开发中最关键的 C 语言特性，包括指针操作、结构体设计、位操作技巧以及嵌入式 C 编程的特殊关键字。

!!! info "学习目标"
    - 深入理解指针的使用和常见陷阱
    - 掌握结构体在嵌入式系统中的应用
    - 熟练运用位操作进行硬件寄存器控制
    - 理解 volatile、const、static 在嵌入式开发中的作用
    - 能够阅读和编写 Zephyr 风格的 C 代码

## 1. 指针深入理解

指针是 C 语言最强大也最容易出错的特性。在 Zephyr 开发中，指针无处不在：设备驱动、内存管理、回调函数等。

### 1.1 指针基础操作

**指针声明、取地址和解引用**：

```c
#include <zephyr/kernel.h>

void pointer_basics(void)
{
    int value = 42;
    int *ptr;           // 声明指针
    
    ptr = &value;       // 取地址：ptr 指向 value
    
    printk("value = %d\n", value);        // 输出: 42
    printk("&value = %p\n", &value);      // 输出: value 的地址
    printk("ptr = %p\n", ptr);            // 输出: ptr 存储的地址（与 &value 相同）
    printk("*ptr = %d\n", *ptr);          // 解引用：输出 42
    
    *ptr = 100;         // 通过指针修改 value
    printk("value = %d\n", value);        // 输出: 100
}
```

### 1.2 指针与数组


在 C 语言中，数组名本质上是指向数组首元素的指针：

```c
#include <zephyr/kernel.h>

void array_pointer_relationship(void)
{
    uint8_t buffer[5] = {1, 2, 3, 4, 5};
    uint8_t *ptr = buffer;  // 数组名即指针
    
    // 以下三种访问方式等价
    printk("buffer[2] = %d\n", buffer[2]);      // 数组下标访问
    printk("*(buffer + 2) = %d\n", *(buffer + 2));  // 指针算术
    printk("ptr[2] = %d\n", ptr[2]);            // 指针下标访问
    
    // 指针遍历数组
    for (int i = 0; i < 5; i++) {
        printk("*(ptr + %d) = %d\n", i, *(ptr + i));
    }
}
```

### 1.3 函数指针（Zephyr 回调函数）

Zephyr 中大量使用函数指针实现回调机制，例如定时器回调、中断处理等：

```c
#include <zephyr/kernel.h>

// 定义定时器回调函数类型
typedef void (*timer_callback_t)(struct k_timer *timer);

// 定时器回调函数实现
void my_timer_callback(struct k_timer *timer)
{
    printk("Timer expired!\n");
}

void function_pointer_example(void)
{
    // 声明并初始化定时器
    K_TIMER_DEFINE(my_timer, my_timer_callback, NULL);
    
    // 启动定时器：1 秒后触发，周期 1 秒
    k_timer_start(&my_timer, K_SECONDS(1), K_SECONDS(1));
}
```


**Zephyr 设备驱动中的函数指针**：

```c
#include <zephyr/device.h>

// GPIO 驱动 API 结构体（包含函数指针）
struct gpio_driver_api {
    int (*pin_configure)(const struct device *dev, gpio_pin_t pin, gpio_flags_t flags);
    int (*port_get_raw)(const struct device *dev, gpio_port_value_t *value);
    int (*port_set_masked_raw)(const struct device *dev, gpio_port_pins_t mask,
                               gpio_port_value_t value);
    // ... 更多函数指针
};

// 使用驱动 API
void use_gpio_driver(const struct device *gpio_dev)
{
    const struct gpio_driver_api *api = 
        (const struct gpio_driver_api *)gpio_dev->api;
    
    // 通过函数指针调用驱动函数
    api->pin_configure(gpio_dev, 13, GPIO_OUTPUT);
}
```

### 1.4 常见指针陷阱

!!! warning "野指针（Dangling Pointer）"
    野指针是指向已释放或无效内存的指针，使用野指针会导致未定义行为。
    
    ```c
    int *ptr;           // 未初始化的指针（野指针）
    *ptr = 42;          // 危险！可能导致程序崩溃
    
    // 正确做法：初始化指针
    int *ptr = NULL;    // 或指向有效内存
    if (ptr != NULL) {
        *ptr = 42;
    }
    ```

!!! warning "悬空指针（Dangling Pointer）"
    指向已释放内存的指针：
    
    ```c
    int *ptr = k_malloc(sizeof(int));
    *ptr = 42;
    k_free(ptr);
    // ptr 现在是悬空指针
    
    // 正确做法：释放后置空
    k_free(ptr);
    ptr = NULL;
    ```


!!! warning "指针越界"
    访问数组边界之外的内存：
    
    ```c
    uint8_t buffer[10];
    uint8_t *ptr = buffer;
    
    // 危险！越界访问
    ptr[10] = 0xFF;     // buffer 只有 10 个元素（索引 0-9）
    
    // 正确做法：检查边界
    size_t index = 10;
    if (index < ARRAY_SIZE(buffer)) {
        ptr[index] = 0xFF;
    }
    ```

## 2. 结构体与联合体

结构体是 Zephyr 中组织数据的核心方式，从设备描述符到内核对象，都使用结构体。

### 2.1 结构体定义和初始化

**基本结构体定义**：

```c
#include <zephyr/kernel.h>

// 定义传感器数据结构体
struct sensor_data {
    int16_t temperature;    // 温度（0.01°C 单位）
    uint16_t humidity;      // 湿度（0.01% 单位）
    uint32_t timestamp;     // 时间戳（毫秒）
};

void struct_initialization(void)
{
    // 方法 1：逐字段初始化
    struct sensor_data data1;
    data1.temperature = 2550;   // 25.50°C
    data1.humidity = 6500;      // 65.00%
    data1.timestamp = k_uptime_get_32();
    
    // 方法 2：初始化列表（推荐）
    struct sensor_data data2 = {
        .temperature = 2550,
        .humidity = 6500,
        .timestamp = k_uptime_get_32()
    };
    
    printk("Temperature: %d.%02d°C\n", 
           data2.temperature / 100, data2.temperature % 100);
}
```


**Zephyr 设备结构体示例**：

```c
#include <zephyr/device.h>

// Zephyr 设备结构体（简化版）
struct device {
    const char *name;               // 设备名称
    const void *config;             // 配置数据
    const void *api;                // API 函数指针表
    void *data;                     // 运行时数据
    uint8_t state;                  // 设备状态
};

// 自定义 I2C 传感器设备数据
struct my_sensor_data {
    const struct device *i2c_dev;   // I2C 总线设备
    uint8_t i2c_addr;               // I2C 地址
    int16_t last_reading;           // 最后读数
};

// 设备配置
struct my_sensor_config {
    const char *i2c_bus_label;
    uint8_t i2c_address;
};

// 使用 Zephyr 宏定义设备
#define MY_SENSOR_INIT(inst) \
    static struct my_sensor_data my_sensor_data_##inst = { \
        .i2c_addr = DT_INST_REG_ADDR(inst), \
    }; \
    static const struct my_sensor_config my_sensor_config_##inst = { \
        .i2c_bus_label = DT_INST_BUS_LABEL(inst), \
        .i2c_address = DT_INST_REG_ADDR(inst), \
    };
```

### 2.2 位域（硬件寄存器操作）

位域允许在结构体中定义按位存储的字段，非常适合映射硬件寄存器：

```c
#include <stdint.h>

// 定义 GPIO 控制寄存器（假设 32 位）
struct gpio_ctrl_reg {
    uint32_t pin_mode : 2;      // 位 0-1: 引脚模式（输入/输出/复用）
    uint32_t pull_type : 2;     // 位 2-3: 上拉/下拉配置
    uint32_t speed : 2;         // 位 4-5: 输出速度
    uint32_t reserved1 : 2;     // 位 6-7: 保留
    uint32_t output_type : 1;   // 位 8: 输出类型（推挽/开漏）
    uint32_t reserved2 : 23;    // 位 9-31: 保留
};


void configure_gpio_pin(volatile struct gpio_ctrl_reg *reg)
{
    // 配置为输出模式，推挽输出，高速
    reg->pin_mode = 0b01;       // 输出模式
    reg->output_type = 0;       // 推挽输出
    reg->speed = 0b11;          // 高速
    reg->pull_type = 0b00;      // 无上下拉
}
```

!!! tip "位域使用注意事项"
    - 位域的内存布局依赖于编译器实现，不同编译器可能不同
    - 位域不能取地址（不能使用 `&` 运算符）
    - 跨平台代码中，建议使用位操作宏而非位域
    - Zephyr 更推荐使用 `BIT()` 宏和位操作函数

### 2.3 结构体对齐和填充

编译器会自动对齐结构体成员以提高访问效率，这可能导致结构体大小大于所有成员大小之和：

```c
#include <stdio.h>

// 未优化的结构体
struct unoptimized {
    char a;         // 1 字节
    int b;          // 4 字节（对齐到 4 字节边界，前面填充 3 字节）
    char c;         // 1 字节
    int d;          // 4 字节（对齐到 4 字节边界，前面填充 3 字节）
};  // 总大小：16 字节（1 + 3填充 + 4 + 1 + 3填充 + 4）

// 优化后的结构体（重新排列成员）
struct optimized {
    int b;          // 4 字节
    int d;          // 4 字节
    char a;         // 1 字节
    char c;         // 1 字节
};  // 总大小：12 字节（4 + 4 + 1 + 1 + 2填充）

void struct_alignment_demo(void)
{
    printk("sizeof(unoptimized) = %zu\n", sizeof(struct unoptimized));  // 16
    printk("sizeof(optimized) = %zu\n", sizeof(struct optimized));      // 12
}
```


!!! tip "结构体优化建议"
    - 将大尺寸成员（如 `int`、`long`、指针）放在前面
    - 将小尺寸成员（如 `char`、`bool`）放在后面
    - 使用 `__packed` 属性强制紧凑排列（但会降低访问效率）
    - 在嵌入式系统中，内存优化很重要，但不要过度优化影响可读性

## 3. 位操作

位操作是嵌入式开发的基本功，用于控制硬件寄存器、设置标志位等。

### 3.1 基本位操作

```c
#include <zephyr/kernel.h>
#include <zephyr/sys/util.h>

void basic_bit_operations(void)
{
    uint32_t reg = 0x00000000;
    
    // 1. 设置位（Set Bit）- 将第 n 位置 1
    reg |= BIT(3);              // 设置第 3 位
    printk("Set bit 3: 0x%08X\n", reg);  // 0x00000008
    
    // 2. 清除位（Clear Bit）- 将第 n 位置 0
    reg &= ~BIT(3);             // 清除第 3 位
    printk("Clear bit 3: 0x%08X\n", reg);  // 0x00000000
    
    // 3. 切换位（Toggle Bit）- 翻转第 n 位
    reg ^= BIT(5);              // 切换第 5 位
    printk("Toggle bit 5: 0x%08X\n", reg);  // 0x00000020
    reg ^= BIT(5);              // 再次切换
    printk("Toggle bit 5 again: 0x%08X\n", reg);  // 0x00000000
    
    // 4. 检查位（Test Bit）- 测试第 n 位是否为 1
    reg = 0x00000028;           // 二进制: 0010 1000（第 3 位和第 5 位为 1）
    if (reg & BIT(3)) {
        printk("Bit 3 is set\n");
    }
    if (!(reg & BIT(4))) {
        printk("Bit 4 is clear\n");
    }
}
```


### 3.2 多位操作（位段读写）

```c
#include <zephyr/sys/util.h>

void multi_bit_operations(void)
{
    uint32_t reg = 0x00000000;
    
    // 1. 设置多个位
    reg |= (BIT(0) | BIT(2) | BIT(4));  // 设置第 0、2、4 位
    printk("Set multiple bits: 0x%08X\n", reg);  // 0x00000015
    
    // 2. 清除多个位
    reg &= ~(BIT(0) | BIT(4));          // 清除第 0、4 位
    printk("Clear multiple bits: 0x%08X\n", reg);  // 0x00000004
    
    // 3. 读取位段（例如读取第 4-7 位）
    uint32_t value = (reg >> 4) & 0x0F;  // 右移 4 位，然后屏蔽低 4 位
    printk("Read bits 4-7: 0x%X\n", value);
    
    // 4. 写入位段（例如将第 8-11 位设置为 0b1010）
    reg &= ~(0x0F << 8);                // 先清除第 8-11 位
    reg |= (0x0A << 8);                 // 再设置为 0b1010
    printk("Write bits 8-11: 0x%08X\n", reg);  // 0x00000A04
    
    // 5. 使用掩码操作
    #define GPIO_MODE_MASK      0x03    // 位 0-1
    #define GPIO_MODE_SHIFT     0
    #define GPIO_SPEED_MASK     0x03    // 位 4-5
    #define GPIO_SPEED_SHIFT    4
    
    // 设置模式为 0b10（输出模式）
    reg &= ~(GPIO_MODE_MASK << GPIO_MODE_SHIFT);
    reg |= (0x02 << GPIO_MODE_SHIFT);
    
    // 设置速度为 0b11（高速）
    reg &= ~(GPIO_SPEED_MASK << GPIO_SPEED_SHIFT);
    reg |= (0x03 << GPIO_SPEED_SHIFT);
    
    printk("Configure GPIO: 0x%08X\n", reg);
}
```

### 3.3 Zephyr 中的 BIT() 宏

Zephyr 提供了一系列位操作宏，使代码更清晰：

```c
#include <zephyr/sys/util.h>

// BIT(n) - 生成第 n 位为 1 的值
#define MY_FLAG_ENABLE      BIT(0)  // 0x00000001
#define MY_FLAG_READY       BIT(1)  // 0x00000002
#define MY_FLAG_ERROR       BIT(2)  // 0x00000004


void zephyr_bit_macros(void)
{
    uint32_t flags = 0;
    
    // 设置标志
    flags |= MY_FLAG_ENABLE;
    flags |= MY_FLAG_READY;
    
    // 检查标志
    if (flags & MY_FLAG_ENABLE) {
        printk("Device is enabled\n");
    }
    
    // 清除标志
    flags &= ~MY_FLAG_READY;
    
    // GENMASK(h, l) - 生成从第 l 位到第 h 位都为 1 的掩码
    uint32_t mask = GENMASK(7, 4);  // 0x000000F0（第 4-7 位为 1）
    printk("GENMASK(7, 4) = 0x%08X\n", mask);
    
    // BIT_MASK(n) - 生成低 n 位都为 1 的掩码
    uint32_t mask2 = BIT_MASK(4);   // 0x0000000F（低 4 位为 1）
    printk("BIT_MASK(4) = 0x%08X\n", mask2);
}
```

!!! tip "位操作最佳实践"
    - 使用 `BIT(n)` 宏而不是 `(1 << n)`，更清晰
    - 使用有意义的宏名称定义位标志，提高可读性
    - 操作硬件寄存器时，先读取、修改、再写回（Read-Modify-Write）
    - 注意位操作的优先级，必要时使用括号

## 4. 嵌入式 C 特性

嵌入式 C 编程有一些特殊的关键字和用法，理解它们对于编写正确的 Zephyr 代码至关重要。

### 4.1 volatile 关键字

`volatile` 告诉编译器该变量可能被程序外部因素改变（如硬件、中断），不要对其进行优化。

**使用场景 1：硬件寄存器**

```c
#include <stdint.h>

// 定义 GPIO 寄存器地址（假设）
#define GPIO_BASE_ADDR      0x40020000
#define GPIO_IDR_OFFSET     0x10

// 错误：不使用 volatile
uint32_t *gpio_idr = (uint32_t *)(GPIO_BASE_ADDR + GPIO_IDR_OFFSET);

void read_gpio_wrong(void)
{
    uint32_t value1 = *gpio_idr;
    uint32_t value2 = *gpio_idr;
    // 编译器可能优化为只读取一次，value1 和 value2 使用相同的值
}


// 正确：使用 volatile
volatile uint32_t *gpio_idr_v = (volatile uint32_t *)(GPIO_BASE_ADDR + GPIO_IDR_OFFSET);

void read_gpio_correct(void)
{
    uint32_t value1 = *gpio_idr_v;
    uint32_t value2 = *gpio_idr_v;
    // 编译器保证每次都从硬件读取，value1 和 value2 可能不同
}
```

**使用场景 2：中断服务程序中修改的变量**

```c
#include <zephyr/kernel.h>

// 错误：不使用 volatile
static int button_pressed = 0;

void button_isr(const struct device *dev, struct gpio_callback *cb, uint32_t pins)
{
    button_pressed = 1;  // 在 ISR 中修改
}

void main_loop_wrong(void)
{
    while (!button_pressed) {
        // 编译器可能优化为死循环，因为它认为 button_pressed 不会改变
        k_sleep(K_MSEC(100));
    }
}

// 正确：使用 volatile
static volatile int button_pressed_v = 0;

void button_isr_correct(const struct device *dev, struct gpio_callback *cb, uint32_t pins)
{
    button_pressed_v = 1;
}

void main_loop_correct(void)
{
    while (!button_pressed_v) {
        // 编译器保证每次都重新读取 button_pressed_v
        k_sleep(K_MSEC(100));
    }
}
```

!!! warning "volatile 不保证原子性"
    `volatile` 只保证每次访问都从内存读取，不保证操作的原子性。对于多线程共享变量，需要使用互斥锁或原子操作。

### 4.2 const 关键字

`const` 声明常量，防止意外修改，也可以帮助编译器优化。


**使用场景 1：常量配置**

```c
#include <zephyr/device.h>

// 设备配置数据
struct sensor_config {
    const char *i2c_bus_label;  // 指向常量字符串的指针
    uint8_t i2c_address;
    uint16_t sample_rate;
};

// 定义常量配置（整个结构体实例是 const）
static const struct sensor_config my_sensor_cfg = {
    .i2c_bus_label = "I2C_1",
    .i2c_address = 0x48,
    .sample_rate = 100
};

void use_config(void)
{
    // 可以读取
    printk("I2C address: 0x%02X\n", my_sensor_cfg.i2c_address);
    
    // 编译错误：不能修改 const 结构体实例的成员
    // my_sensor_cfg.i2c_address = 0x49;
    
    // 也不能修改指针指向的字符串
    // my_sensor_cfg.i2c_bus_label[0] = 'X';  // 编译错误
}
```

**使用场景 2：只读数据（节省 RAM）**

```c
// 存储在 Flash（ROM）中，不占用 RAM
static const uint8_t sine_table[256] = {
    128, 131, 134, 137, /* ... */ 125
};

// 存储在 RAM 中
static uint8_t buffer[256];

void const_data_placement(void)
{
    // sine_table 在 Flash 中，只读
    uint8_t value = sine_table[100];
    
    // buffer 在 RAM 中，可读写
    buffer[100] = value;
}
```

**const 指针的四种形式**：

```c
int value = 42;

// 1. 指向常量的指针（指针可变，指向的数据不可变）
const int *ptr1 = &value;
// ptr1 = &other_value;  // OK
// *ptr1 = 100;          // 错误：不能修改指向的数据

// 2. 常量指针（指针不可变，指向的数据可变）
int *const ptr2 = &value;
// ptr2 = &other_value;  // 错误：不能修改指针
// *ptr2 = 100;          // OK

// 3. 指向常量的常量指针（指针和数据都不可变）
const int *const ptr3 = &value;
// ptr3 = &other_value;  // 错误
// *ptr3 = 100;          // 错误

// 4. 普通指针（指针和数据都可变）
int *ptr4 = &value;
// ptr4 = &other_value;  // OK
// *ptr4 = 100;          // OK
```


### 4.3 static 关键字

`static` 有两个主要用途：限制作用域和保持变量生命周期。

**使用场景 1：文件作用域（限制符号可见性）**

```c
// my_driver.c

// 静态全局变量：只在本文件可见
static int driver_initialized = 0;

// 静态函数：只在本文件可见
static int internal_helper(void)
{
    return 42;
}

// 公共函数：其他文件可见
int my_driver_init(void)
{
    if (!driver_initialized) {
        internal_helper();
        driver_initialized = 1;
    }
    return 0;
}
```

**使用场景 2：函数内静态变量（保持状态）**

```c
#include <zephyr/kernel.h>

// 计数器函数：每次调用返回递增的值
int get_next_id(void)
{
    static int counter = 0;  // 静态局部变量，只初始化一次
    return counter++;
}

void static_variable_demo(void)
{
    printk("ID 1: %d\n", get_next_id());  // 输出: 0
    printk("ID 2: %d\n", get_next_id());  // 输出: 1
    printk("ID 3: %d\n", get_next_id());  // 输出: 2
}
```

**Zephyr 中的 static 使用**：

```c
#include <zephyr/device.h>

// 驱动私有数据（static 限制作用域）
static struct my_driver_data {
    const struct device *i2c_dev;
    uint8_t device_addr;
    bool initialized;
} driver_data;

// 驱动初始化函数（static 表示内部函数）
static int my_driver_init(const struct device *dev)
{
    struct my_driver_data *data = dev->data;
    
    // 初始化逻辑
    data->initialized = true;
    
    return 0;
}

// 设备定义（使用 static 数据）
DEVICE_DEFINE(my_device, "MY_DEVICE",
              my_driver_init, NULL,
              &driver_data, NULL,
              POST_KERNEL, CONFIG_KERNEL_INIT_PRIORITY_DEVICE,
              NULL);
```


!!! tip "static 使用建议"
    - 默认将文件内部使用的函数和变量声明为 `static`，减少符号冲突
    - 使用 `static` 可以帮助编译器优化（内联、死代码消除）
    - 在 Zephyr 驱动开发中，大量使用 `static` 限制驱动内部实现的可见性

## 5. Zephyr 代码示例

下面是一个完整的 Zephyr 设备驱动示例，综合运用了本章所学的 C 语言特性：

```c
#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/i2c.h>
#include <zephyr/sys/util.h>

// 设备寄存器定义（使用位操作宏）
#define REG_CTRL            0x00
#define REG_STATUS          0x01
#define REG_DATA_H          0x02
#define REG_DATA_L          0x03

// 控制寄存器位定义
#define CTRL_ENABLE         BIT(0)
#define CTRL_RESET          BIT(1)
#define CTRL_MODE_MASK      GENMASK(3, 2)
#define CTRL_MODE_SHIFT     2

// 状态寄存器位定义
#define STATUS_READY        BIT(0)
#define STATUS_ERROR        BIT(7)

// 设备配置结构体（const，存储在 Flash）
struct my_sensor_config {
    const char *i2c_bus_label;
    uint8_t i2c_address;
};

// 设备运行时数据结构体
struct my_sensor_data {
    const struct device *i2c_dev;
    int16_t last_reading;
    volatile bool data_ready;  // 可能在 ISR 中修改
};

// 静态辅助函数：读取寄存器
static int read_register(const struct device *dev, uint8_t reg, uint8_t *value)
{
    const struct my_sensor_config *cfg = dev->config;
    struct my_sensor_data *data = dev->data;
    
    return i2c_reg_read_byte(data->i2c_dev, cfg->i2c_address, reg, value);
}


// 静态辅助函数：写入寄存器
static int write_register(const struct device *dev, uint8_t reg, uint8_t value)
{
    const struct my_sensor_config *cfg = dev->config;
    struct my_sensor_data *data = dev->data;
    
    return i2c_reg_write_byte(data->i2c_dev, cfg->i2c_address, reg, value);
}

// 设备初始化函数
static int my_sensor_init(const struct device *dev)
{
    const struct my_sensor_config *cfg = dev->config;
    struct my_sensor_data *data = dev->data;
    uint8_t ctrl_reg;
    
    // 获取 I2C 总线设备
    data->i2c_dev = device_get_binding(cfg->i2c_bus_label);
    if (!data->i2c_dev) {
        return -ENODEV;
    }
    
    // 复位设备
    ctrl_reg = CTRL_RESET;
    write_register(dev, REG_CTRL, ctrl_reg);
    k_msleep(10);
    
    // 配置设备：使能，设置模式为 0b10
    ctrl_reg = CTRL_ENABLE;
    ctrl_reg &= ~CTRL_MODE_MASK;
    ctrl_reg |= (0x02 << CTRL_MODE_SHIFT);
    write_register(dev, REG_CTRL, ctrl_reg);
    
    return 0;
}

// 读取传感器数据
static int my_sensor_read(const struct device *dev, int16_t *value)
{
    struct my_sensor_data *data = dev->data;
    uint8_t status, data_h, data_l;
    int ret;
    
    // 检查状态寄存器
    ret = read_register(dev, REG_STATUS, &status);
    if (ret < 0) {
        return ret;
    }
    
    // 检查数据就绪位
    if (!(status & STATUS_READY)) {
        return -EBUSY;
    }
    
    // 检查错误位
    if (status & STATUS_ERROR) {
        return -EIO;
    }
    
    // 读取数据（高字节和低字节）
    read_register(dev, REG_DATA_H, &data_h);
    read_register(dev, REG_DATA_L, &data_l);
    
    // 组合为 16 位数据
    *value = (int16_t)((data_h << 8) | data_l);
    data->last_reading = *value;
    
    return 0;
}


// 定义设备实例
#define MY_SENSOR_INIT(inst) \
    static struct my_sensor_data my_sensor_data_##inst = { \
        .data_ready = false, \
    }; \
    \
    static const struct my_sensor_config my_sensor_config_##inst = { \
        .i2c_bus_label = DT_INST_BUS_LABEL(inst), \
        .i2c_address = DT_INST_REG_ADDR(inst), \
    }; \
    \
    DEVICE_DT_INST_DEFINE(inst, \
                          my_sensor_init, \
                          NULL, \
                          &my_sensor_data_##inst, \
                          &my_sensor_config_##inst, \
                          POST_KERNEL, \
                          CONFIG_SENSOR_INIT_PRIORITY, \
                          NULL);

// 为设备树中的每个实例创建设备
DT_INST_FOREACH_STATUS_OKAY(MY_SENSOR_INIT)
```

**代码说明**：

1. **指针使用**：`dev->config`、`dev->data` 访问设备结构体成员
2. **const 使用**：配置数据声明为 `const`，存储在 Flash 中节省 RAM
3. **volatile 使用**：`data_ready` 可能在中断中修改，使用 `volatile`
4. **static 使用**：内部函数和数据使用 `static` 限制作用域
5. **位操作**：使用 `BIT()`、`GENMASK()` 宏操作寄存器位
6. **结构体**：使用结构体组织配置和运行时数据

## 6. 自我评估测试

测试你对 C 语言核心能力的掌握程度：

### 测试题 1：指针操作

```c
int arr[5] = {10, 20, 30, 40, 50};
int *p = arr + 2;

// 问题：以下表达式的值是多少？
// A. *p
// B. *(p + 1)
// C. *(p - 1)
// D. p[1]
```

<details>
<summary>点击查看答案</summary>

- **A. *p = 30**（p 指向 arr[2]）
- **B. *(p + 1) = 40**（p + 1 指向 arr[3]）
- **C. *(p - 1) = 20**（p - 1 指向 arr[1]）
- **D. p[1] = 40**（等价于 *(p + 1)）

</details>


### 测试题 2：位操作

```c
uint8_t reg = 0b10110100;

// 问题：执行以下操作后，reg 的值是多少？
reg &= ~BIT(2);     // 清除第 2 位
reg |= BIT(0);      // 设置第 0 位
reg ^= BIT(5);      // 切换第 5 位
```

<details>
<summary>点击查看答案</summary>

1. 初始值：`0b10110100`（0xB4）
2. 清除第 2 位：`0b10110100 & ~0b00000100 = 0b10110000`（0xB0）
3. 设置第 0 位：`0b10110000 | 0b00000001 = 0b10110001`（0xB1）
4. 切换第 5 位：`0b10110001 ^ 0b00100000 = 0b10010001`（0x91）

**最终答案：0b10010001（0x91，十进制 145）**

</details>

### 测试题 3：volatile 关键字

```c
volatile uint32_t *gpio_reg = (volatile uint32_t *)0x40020000;

void wait_for_ready(void)
{
    while (!(*gpio_reg & BIT(0))) {
        // 等待第 0 位变为 1
    }
}

// 问题：为什么 gpio_reg 必须声明为 volatile？
```

<details>
<summary>点击查看答案</summary>

**必须使用 volatile 的原因**：

1. `gpio_reg` 指向硬件寄存器，其值可能被硬件改变
2. 如果不使用 `volatile`，编译器可能优化为：
   - 只读取一次 `*gpio_reg`
   - 如果第一次读取第 0 位为 0，则认为永远为 0
   - 优化为死循环，永远不会退出
3. 使用 `volatile` 后，编译器保证每次循环都重新从硬件读取寄存器值
4. 这样当硬件将第 0 位置 1 时，循环能够正确退出

**关键点**：`volatile` 告诉编译器"这个变量可能被程序外部因素改变，不要优化对它的访问"。

</details>


### 测试题 4：结构体对齐

```c
struct example {
    char a;     // 1 字节
    int b;      // 4 字节
    char c;     // 1 字节
};

// 问题：sizeof(struct example) 的值是多少？（假设 int 为 4 字节，默认对齐）
// A. 6
// B. 8
// C. 12
// D. 16
```

<details>
<summary>点击查看答案</summary>

**答案：C. 12 字节**

**内存布局**：
```
偏移量  成员    大小    说明
0       a       1       char a
1-3     (填充)  3       为 int b 对齐到 4 字节边界
4-7     b       4       int b
8       c       1       char c
9-11    (填充)  3       结构体总大小对齐到 4 字节（int 的对齐要求）
```

**总大小：12 字节**

**优化建议**：重新排列成员顺序可以减少填充：
```c
struct optimized {
    int b;      // 4 字节
    char a;     // 1 字节
    char c;     // 1 字节
    // 2 字节填充
};  // 总大小：8 字节
```

</details>

### 测试题 5：函数指针

```c
typedef void (*callback_t)(int value);

void my_callback(int value)
{
    printk("Callback called with value: %d\n", value);
}

void register_callback(callback_t cb)
{
    cb(42);
}

// 问题：如何正确调用 register_callback 函数？
```

<details>
<summary>点击查看答案</summary>

**正确调用方式**：

```c
// 方法 1：直接传递函数名
register_callback(my_callback);

// 方法 2：显式取地址（效果相同）
register_callback(&my_callback);
```

**输出**：
```
Callback called with value: 42
```

**说明**：
- 函数名本身就是函数指针
- `my_callback` 和 `&my_callback` 在这里是等价的
- 函数指针类型必须匹配：参数类型和返回值类型都要一致

</details>


## 7. 学习检查清单

完成本章学习后，你应该能够：

- [ ] 熟练使用指针进行数据访问和操作
- [ ] 理解指针与数组的关系，能够使用指针遍历数组
- [ ] 使用函数指针实现回调机制
- [ ] 识别和避免常见的指针错误（野指针、悬空指针、越界）
- [ ] 定义和使用结构体组织复杂数据
- [ ] 理解结构体对齐和填充，能够优化结构体内存布局
- [ ] 使用位域映射硬件寄存器（了解其局限性）
- [ ] 熟练使用位操作（设置、清除、切换、检查位）
- [ ] 使用 Zephyr 的 `BIT()` 和 `GENMASK()` 宏
- [ ] 理解 `volatile` 的作用，知道何时使用它
- [ ] 正确使用 `const` 声明常量和只读数据
- [ ] 使用 `static` 限制符号作用域和保持变量状态
- [ ] 能够阅读和理解 Zephyr 设备驱动代码
- [ ] 编写符合 Zephyr 编码规范的 C 代码

## 8. 下一步学习

掌握了 C 语言核心能力后，你可以继续学习：

- [嵌入式硬件基础](embedded-basics.md)：了解 ARM Cortex-M 架构和硬件知识
- [RTOS 基础概念](rtos-concepts.md)：学习实时操作系统的核心概念
- [基础工具能力](tools.md)：掌握开发工具的使用

或者直接进入：

- [第一阶段：入门筑基期](../stage1-foundation/index.md)：开始 Zephyr RTOS 的实战学习

## 9. 参考资源

### 官方文档

- [Zephyr Coding Style](https://docs.zephyrproject.org/latest/contribute/guidelines.html#coding-style)
- [Zephyr API Documentation](https://docs.zephyrproject.org/latest/doxygen/html/index.html)

### 推荐阅读

- 《C 专家编程》（Expert C Programming）
- 《C 陷阱与缺陷》（C Traps and Pitfalls）
- 《嵌入式 C 编程》（Embedded C Coding Standard）

### 在线资源

- [C 语言参考手册](https://en.cppreference.com/w/c)
- [Zephyr 示例代码](https://github.com/zephyrproject-rtos/zephyr/tree/main/samples)

---

!!! success "恭喜！"
    你已经完成了 C 语言核心能力的学习。这些知识是 Zephyr RTOS 开发的基石，将在后续的学习中反复使用。继续保持学习的热情，向着 Zephyr 专家的目标前进！
