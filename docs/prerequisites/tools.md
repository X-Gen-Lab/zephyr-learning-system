---
title: "基础工具能力"
description: "掌握 Zephyr 开发必备的工具链，包括 Git、命令行、调试工具和串口工具"
tags: ["前置知识", "工具", "Git", "GDB", "命令行"]
difficulty: "初级"
estimated_time: "1-2 天"
---

# 基础工具能力

在开始 Zephyr RTOS 开发之前，掌握一些基础工具是必不可少的。这些工具将贯穿你的整个开发过程，从代码管理到调试测试，都离不开它们的支持。

!!! info "学习目标"
    完成本节学习后，你将能够：
    
    - 使用 Git 进行版本控制和代码管理
    - 熟练使用命令行工具进行文件操作和系统管理
    - 使用 GDB 进行源码级调试
    - 配置和使用硬件调试器（J-Link、OpenOCD）
    - 使用串口工具查看程序输出和交互

## Git 版本控制

Git 是现代软件开发中最流行的版本控制系统。Zephyr 项目本身就托管在 GitHub 上，掌握 Git 是参与 Zephyr 开发的基础。

### Git 基础命令

#### 仓库操作

```bash
# 克隆远程仓库
git clone https://github.com/zephyrproject-rtos/zephyr.git

# 查看仓库状态
git status

# 查看提交历史
git log --oneline --graph --all

# 查看远程仓库信息
git remote -v
```

#### 文件操作

```bash
# 添加文件到暂存区
git add <file>              # 添加单个文件
git add .                   # 添加所有修改的文件
git add -p                  # 交互式添加（选择性添加部分修改）

# 提交更改
git commit -m "描述性的提交信息"
git commit -am "添加并提交已跟踪文件的修改"

# 查看文件差异
git diff                    # 查看工作区与暂存区的差异
git diff --staged           # 查看暂存区与最后一次提交的差异
git diff HEAD               # 查看工作区与最后一次提交的差异
```


#### 分支管理

```bash
# 查看分支
git branch                  # 查看本地分支
git branch -a               # 查看所有分支（包括远程）

# 创建分支
git branch <branch-name>    # 创建新分支
git checkout -b <branch-name>  # 创建并切换到新分支

# 切换分支
git checkout <branch-name>
git switch <branch-name>    # Git 2.23+ 新命令

# 合并分支
git merge <branch-name>     # 将指定分支合并到当前分支

# 删除分支
git branch -d <branch-name>    # 删除已合并的分支
git branch -D <branch-name>    # 强制删除分支
```

#### 远程操作

```bash
# 拉取远程更新
git fetch                   # 获取远程更新但不合并
git pull                    # 获取并合并远程更新
git pull --rebase           # 使用 rebase 方式合并

# 推送到远程
git push                    # 推送当前分支
git push origin <branch>    # 推送指定分支
git push -u origin <branch> # 推送并设置上游分支

# 同步 fork 的仓库
git remote add upstream https://github.com/zephyrproject-rtos/zephyr.git
git fetch upstream
git merge upstream/main
```

!!! tip "Git 最佳实践"
    1. **提交信息要清晰**：使用描述性的提交信息，说明"做了什么"和"为什么"
    2. **小步提交**：每次提交只包含一个逻辑变更，便于回溯和审查
    3. **经常拉取**：定期从远程仓库拉取更新，避免冲突积累
    4. **使用分支**：为新功能或修复创建独立分支，保持主分支稳定
    5. **提交前检查**：使用 `git diff` 和 `git status` 确认要提交的内容
    6. **不要提交敏感信息**：密码、密钥等敏感信息不应提交到仓库

### Git 配置

```bash
# 配置用户信息
git config --global user.name "你的名字"
git config --global user.email "your.email@example.com"

# 配置编辑器
git config --global core.editor "vim"

# 配置别名（简化常用命令）
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --oneline --graph --all"

# 查看配置
git config --list
```


## 命令行工具

命令行是嵌入式开发的重要工具，无论是编译代码、烧录固件还是查看日志，都需要使用命令行。

### 文件和目录操作

=== "Linux/macOS"

    ```bash
    # 目录操作
    pwd                     # 显示当前目录
    ls                      # 列出文件
    ls -la                  # 详细列出所有文件（包括隐藏文件）
    cd <directory>          # 切换目录
    cd ~                    # 切换到家目录
    cd -                    # 切换到上一个目录
    mkdir <directory>       # 创建目录
    mkdir -p path/to/dir    # 递归创建目录
    rmdir <directory>       # 删除空目录
    
    # 文件操作
    touch <file>            # 创建空文件或更新时间戳
    cp <source> <dest>      # 复制文件
    cp -r <source> <dest>   # 递归复制目录
    mv <source> <dest>      # 移动或重命名文件
    rm <file>               # 删除文件
    rm -rf <directory>      # 递归强制删除目录（危险！）
    
    # 文件查看
    cat <file>              # 显示文件内容
    less <file>             # 分页查看文件
    head -n 10 <file>       # 显示文件前 10 行
    tail -n 10 <file>       # 显示文件后 10 行
    tail -f <file>          # 实时查看文件更新（常用于日志）
    
    # 文件搜索
    find . -name "*.c"      # 查找 C 源文件
    find . -type f -mtime -7  # 查找 7 天内修改的文件
    grep "pattern" <file>   # 在文件中搜索模式
    grep -r "pattern" .     # 递归搜索当前目录
    ```

=== "Windows (PowerShell)"

    ```powershell
    # 目录操作
    pwd                     # 显示当前目录
    Get-Location            # 显示当前目录（完整命令）
    ls                      # 列出文件
    Get-ChildItem           # 列出文件（完整命令）
    cd <directory>          # 切换目录
    cd ~                    # 切换到家目录
    mkdir <directory>       # 创建目录
    New-Item -ItemType Directory -Path <directory>  # 创建目录（完整命令）
    rmdir <directory>       # 删除空目录
    
    # 文件操作
    New-Item -ItemType File -Path <file>  # 创建空文件
    Copy-Item <source> <dest>             # 复制文件
    Copy-Item -Recurse <source> <dest>    # 递归复制目录
    Move-Item <source> <dest>             # 移动或重命名文件
    Remove-Item <file>                    # 删除文件
    Remove-Item -Recurse -Force <directory>  # 递归强制删除目录
    
    # 文件查看
    Get-Content <file>      # 显示文件内容
    cat <file>              # 显示文件内容（别名）
    Get-Content <file> | Select-Object -First 10   # 显示前 10 行
    Get-Content <file> | Select-Object -Last 10    # 显示后 10 行
    Get-Content <file> -Wait  # 实时查看文件更新
    
    # 文件搜索
    Get-ChildItem -Recurse -Filter "*.c"  # 查找 C 源文件
    Select-String -Pattern "pattern" -Path <file>  # 在文件中搜索
    Select-String -Pattern "pattern" -Path . -Recurse  # 递归搜索
    ```

=== "Windows (CMD)"

    ```cmd
    # 目录操作
    cd                      # 显示当前目录
    dir                     # 列出文件
    dir /a                  # 列出所有文件（包括隐藏文件）
    cd <directory>          # 切换目录
    cd %USERPROFILE%        # 切换到家目录
    mkdir <directory>       # 创建目录
    rmdir <directory>       # 删除空目录
    
    # 文件操作
    type nul > <file>       # 创建空文件
    copy <source> <dest>    # 复制文件
    xcopy /E <source> <dest>  # 递归复制目录
    move <source> <dest>    # 移动或重命名文件
    del <file>              # 删除文件
    rmdir /S /Q <directory> # 递归强制删除目录
    
    # 文件查看
    type <file>             # 显示文件内容
    more <file>             # 分页查看文件
    
    # 文件搜索
    dir /S *.c              # 递归查找 C 源文件
    findstr "pattern" <file>  # 在文件中搜索
    findstr /S "pattern" *    # 递归搜索
    ```


### 系统信息和进程管理

=== "Linux/macOS"

    ```bash
    # 系统信息
    uname -a                # 显示系统信息
    df -h                   # 显示磁盘使用情况
    free -h                 # 显示内存使用情况（Linux）
    top                     # 显示进程和资源使用情况
    htop                    # 更友好的进程查看器（需要安装）
    
    # 进程管理
    ps aux                  # 显示所有进程
    ps aux | grep <name>    # 查找特定进程
    kill <pid>              # 终止进程
    kill -9 <pid>           # 强制终止进程
    killall <name>          # 按名称终止进程
    
    # 权限管理
    chmod +x <file>         # 添加执行权限
    chmod 755 <file>        # 设置权限（rwxr-xr-x）
    chown <user>:<group> <file>  # 更改文件所有者
    sudo <command>          # 以管理员权限执行命令
    ```

=== "Windows (PowerShell)"

    ```powershell
    # 系统信息
    Get-ComputerInfo        # 显示系统信息
    Get-PSDrive             # 显示磁盘使用情况
    Get-Process             # 显示所有进程
    
    # 进程管理
    Get-Process | Where-Object {$_.Name -like "*name*"}  # 查找进程
    Stop-Process -Id <pid>  # 终止进程
    Stop-Process -Name <name>  # 按名称终止进程
    
    # 权限管理
    # 以管理员身份运行 PowerShell
    Start-Process powershell -Verb RunAs
    ```

### 文本处理

=== "Linux/macOS"

    ```bash
    # 文本查看和编辑
    nano <file>             # 简单的文本编辑器
    vim <file>              # 强大的文本编辑器
    
    # 文本处理
    echo "text"             # 输出文本
    echo "text" > file      # 重定向输出到文件（覆盖）
    echo "text" >> file     # 追加输出到文件
    cat file1 file2 > file3 # 合并文件
    
    # 管道和过滤
    command1 | command2     # 将 command1 的输出传递给 command2
    grep "error" log.txt | wc -l  # 统计包含 "error" 的行数
    ls -l | grep "\.c$"     # 列出 C 源文件
    
    # 文本统计
    wc -l <file>            # 统计行数
    wc -w <file>            # 统计单词数
    wc -c <file>            # 统计字节数
    ```

=== "Windows (PowerShell)"

    ```powershell
    # 文本查看和编辑
    notepad <file>          # 记事本
    code <file>             # VS Code（如果已安装）
    
    # 文本处理
    Write-Output "text"     # 输出文本
    "text" | Out-File file  # 输出到文件（覆盖）
    "text" | Out-File -Append file  # 追加到文件
    Get-Content file1, file2 | Set-Content file3  # 合并文件
    
    # 管道和过滤
    command1 | command2     # 将 command1 的输出传递给 command2
    Get-Content log.txt | Select-String "error" | Measure-Object -Line
    Get-ChildItem | Where-Object {$_.Name -like "*.c"}
    
    # 文本统计
    (Get-Content <file>).Count  # 统计行数
    ```


## 调试工具

调试是嵌入式开发中最重要的技能之一。掌握调试工具能够帮助你快速定位和解决问题。

### GDB（GNU Debugger）

GDB 是最常用的源码级调试器，Zephyr 完全支持使用 GDB 进行调试。

#### GDB 基本命令

```bash
# 启动 GDB
gdb <executable>            # 调试可执行文件
gdb --args <executable> <args>  # 带参数启动

# 在 Zephyr 中使用 GDB
west debug                  # 使用 west 启动 GDB 调试会话
west attach                 # 连接到已运行的目标
```

#### GDB 调试命令

```gdb
# 运行控制
run (r)                     # 运行程序
continue (c)                # 继续执行
next (n)                    # 单步执行（不进入函数）
step (s)                    # 单步执行（进入函数）
finish                      # 执行到当前函数返回
until <line>                # 执行到指定行

# 断点管理
break <function>            # 在函数入口设置断点
break <file>:<line>         # 在指定文件的行设置断点
break <address>             # 在地址设置断点
break <location> if <condition>  # 条件断点
info breakpoints (i b)      # 显示所有断点
delete <number>             # 删除断点
disable <number>            # 禁用断点
enable <number>             # 启用断点
clear <location>            # 清除指定位置的断点

# 变量查看
print <variable> (p)        # 打印变量值
print/x <variable>          # 以十六进制打印
print/t <variable>          # 以二进制打印
display <variable>          # 每次停止时自动显示变量
info locals                 # 显示局部变量
info args                   # 显示函数参数

# 内存查看
x/nfu <address>             # 查看内存
  # n: 显示的单元数
  # f: 格式（x=十六进制, d=十进制, u=无符号, t=二进制, c=字符）
  # u: 单元大小（b=字节, h=半字, w=字, g=双字）
x/10xw 0x20000000           # 查看地址 0x20000000 开始的 10 个字（十六进制）

# 调用栈
backtrace (bt)              # 显示调用栈
frame <number> (f)          # 切换到指定栈帧
up                          # 向上移动一个栈帧
down                        # 向下移动一个栈帧
info frame                  # 显示当前栈帧信息

# 寄存器
info registers              # 显示所有寄存器
info registers <reg>        # 显示特定寄存器
set $<reg> = <value>        # 设置寄存器值

# 其他
list (l)                    # 显示源代码
list <function>             # 显示函数源代码
list <file>:<line>          # 显示指定位置源代码
info threads                # 显示所有线程
thread <number>             # 切换到指定线程
quit (q)                    # 退出 GDB
```

#### GDB 配置文件

创建 `.gdbinit` 文件来自定义 GDB 行为：

```gdb
# .gdbinit 示例

# 设置历史记录
set history save on
set history size 10000
set history filename ~/.gdb_history

# 美化输出
set print pretty on
set print array on
set print array-indexes on

# 自动加载符号
set auto-load safe-path /

# Zephyr 特定配置
# 连接到 QEMU
target remote :1234

# 加载符号文件
# file build/zephyr/zephyr.elf

# 设置常用断点
# break main
# break k_sys_fatal_error_handler
```

!!! tip "GDB 使用技巧"
    1. **使用 TUI 模式**：`gdb -tui` 或在 GDB 中按 `Ctrl+X A` 切换到 TUI 模式，可以同时查看源码和命令
    2. **命令缩写**：大多数 GDB 命令都可以缩写，如 `b` 代表 `break`，`p` 代表 `print`
    3. **Tab 补全**：使用 Tab 键可以补全命令、函数名和变量名
    4. **重复命令**：按 Enter 键会重复上一条命令，方便单步调试
    5. **条件断点**：使用条件断点可以在特定情况下才停止，如 `break main.c:42 if count > 100`


### J-Link 调试器

J-Link 是 SEGGER 公司的硬件调试器，广泛用于 ARM 嵌入式开发。

#### J-Link 安装

=== "Ubuntu/Debian"

    ```bash
    # 下载 J-Link 软件包
    # 访问 https://www.segger.com/downloads/jlink/
    # 下载适用于 Linux 的 .deb 包
    
    # 安装
    sudo dpkg -i JLink_Linux_*.deb
    
    # 验证安装
    JLinkExe -v
    
    # 配置 USB 权限
    sudo cp /opt/SEGGER/JLink/99-jlink.rules /etc/udev/rules.d/
    sudo udevadm control --reload-rules
    sudo udevadm trigger
    
    # 将用户添加到 plugdev 组
    sudo usermod -a -G plugdev $USER
    # 注销并重新登录以使组更改生效
    ```

=== "Windows"

    ```powershell
    # 下载 J-Link 软件包
    # 访问 https://www.segger.com/downloads/jlink/
    # 下载 Windows 安装程序
    
    # 运行安装程序
    # JLink_Windows_*.exe
    
    # 安装完成后，J-Link 工具会添加到系统 PATH
    
    # 验证安装（在 PowerShell 或 CMD 中）
    JLink.exe -v
    ```

=== "macOS"

    ```bash
    # 下载 J-Link 软件包
    # 访问 https://www.segger.com/downloads/jlink/
    # 下载 macOS 安装包
    
    # 安装
    # 双击 .pkg 文件并按照提示安装
    
    # 验证安装
    JLinkExe -v
    ```

#### J-Link 使用

```bash
# 启动 J-Link Commander
JLinkExe

# 在 J-Link Commander 中的常用命令
connect                     # 连接到目标设备
  # 选择设备类型（如 nRF52840_xxAA）
  # 选择接口（SWD 或 JTAG）
  # 选择速度（如 4000 kHz）

halt                        # 停止 CPU
go                          # 运行 CPU
reset                       # 复位目标
mem <address>, <count>      # 读取内存
loadfile <file>             # 加载二进制文件到目标
erase                       # 擦除 Flash
exit                        # 退出

# 使用 J-Link GDB Server
JLinkGDBServer -device nRF52840_xxAA -if SWD -speed 4000

# 在另一个终端中启动 GDB 并连接
arm-none-eabi-gdb build/zephyr/zephyr.elf
(gdb) target remote localhost:2331
(gdb) monitor reset
(gdb) load
(gdb) break main
(gdb) continue
```

#### Zephyr 中使用 J-Link

```bash
# 配置 Zephyr 使用 J-Link
# 在 CMakeLists.txt 或命令行中设置
west build -b nrf52840dk_nrf52840 samples/hello_world

# 使用 J-Link 烧录
west flash --runner jlink

# 使用 J-Link 调试
west debug --runner jlink

# 查看 J-Link 支持的选项
west flash --runner jlink --help
```

### OpenOCD

OpenOCD（Open On-Chip Debugger）是一个开源的片上调试器，支持多种硬件调试器和目标芯片。

#### OpenOCD 安装

=== "Ubuntu/Debian"

    ```bash
    # 安装 OpenOCD
    sudo apt-get update
    sudo apt-get install openocd
    
    # 验证安装
    openocd --version
    
    # 配置 USB 权限
    sudo usermod -a -G plugdev $USER
    # 注销并重新登录
    ```

=== "Windows"

    ```powershell
    # 方法 1：使用预编译版本
    # 下载 OpenOCD for Windows
    # https://github.com/xpack-dev-tools/openocd-xpack/releases
    
    # 解压到目录，如 C:\OpenOCD
    # 将 C:\OpenOCD\bin 添加到系统 PATH
    
    # 验证安装
    openocd --version
    
    # 方法 2：使用 MSYS2
    # 安装 MSYS2 后
    pacman -S mingw-w64-x86_64-openocd
    ```

=== "macOS"

    ```bash
    # 使用 Homebrew 安装
    brew install openocd
    
    # 验证安装
    openocd --version
    ```


#### OpenOCD 使用

```bash
# 启动 OpenOCD（以 STM32F4 为例）
openocd -f interface/stlink.cfg -f target/stm32f4x.cfg

# 常用配置文件位置
# Linux: /usr/share/openocd/scripts/
# Windows: <OpenOCD安装目录>/scripts/
# macOS: /usr/local/share/openocd/scripts/

# OpenOCD 启动后会监听端口
# GDB 端口: 3333
# Telnet 端口: 4444

# 使用 Telnet 连接 OpenOCD
telnet localhost 4444

# OpenOCD Telnet 命令
reset halt                  # 复位并停止
reset run                   # 复位并运行
halt                        # 停止 CPU
resume                      # 继续运行
flash write_image erase <file>  # 烧录固件
flash erase_sector 0 0 last # 擦除 Flash
reg                         # 显示寄存器
mdw <address> <count>       # 读取内存（字）
mdb <address> <count>       # 读取内存（字节）
```

#### Zephyr 中使用 OpenOCD

```bash
# 配置 Zephyr 使用 OpenOCD
west build -b stm32f4_disco samples/hello_world

# 使用 OpenOCD 烧录
west flash --runner openocd

# 使用 OpenOCD 调试
west debug --runner openocd

# 自定义 OpenOCD 配置
# 在项目目录创建 openocd.cfg
# 或使用环境变量
export OPENOCD_DEFAULT_PATH=/path/to/openocd/scripts
```

## 串口工具

串口是嵌入式开发中最常用的通信方式，用于查看程序输出、调试信息和与设备交互。

### 串口工具选择

=== "Linux"

    #### minicom
    
    ```bash
    # 安装 minicom
    sudo apt-get install minicom
    
    # 配置 minicom
    sudo minicom -s
    # 选择 "Serial port setup"
    # 设置串口设备（如 /dev/ttyUSB0）
    # 设置波特率（如 115200）
    # 设置数据位（8）、停止位（1）、校验位（None）
    # 保存配置为默认
    
    # 使用 minicom
    minicom -D /dev/ttyUSB0 -b 115200
    
    # minicom 快捷键
    # Ctrl+A Z: 显示帮助
    # Ctrl+A X: 退出
    # Ctrl+A C: 清屏
    ```
    
    #### screen
    
    ```bash
    # screen 通常已预装
    
    # 使用 screen
    screen /dev/ttyUSB0 115200
    
    # screen 快捷键
    # Ctrl+A K: 退出
    # Ctrl+A D: 分离会话
    # screen -r: 重新连接会话
    ```
    
    #### picocom
    
    ```bash
    # 安装 picocom
    sudo apt-get install picocom
    
    # 使用 picocom
    picocom -b 115200 /dev/ttyUSB0
    
    # picocom 快捷键
    # Ctrl+A Ctrl+X: 退出
    ```

=== "Windows"

    #### PuTTY
    
    ```powershell
    # 下载 PuTTY
    # https://www.putty.org/
    
    # 安装后启动 PuTTY
    # 1. 选择 "Serial" 连接类型
    # 2. 设置串口号（如 COM3）
    # 3. 设置波特率（如 115200）
    # 4. 点击 "Open"
    ```
    
    #### Tera Term
    
    ```powershell
    # 下载 Tera Term
    # https://ttssh2.osdn.jp/
    
    # 安装后启动 Tera Term
    # 1. 选择 "Serial"
    # 2. 选择端口（如 COM3）
    # 3. 设置波特率（Setup -> Serial port）
    ```
    
    #### Windows Terminal + PowerShell
    
    ```powershell
    # 使用 PowerShell 访问串口
    $port = new-Object System.IO.Ports.SerialPort COM3,115200,None,8,one
    $port.Open()
    
    # 读取数据
    while($true) {
        if($port.BytesToRead -gt 0) {
            $port.ReadExisting()
        }
    }
    
    # 关闭端口
    $port.Close()
    ```

=== "macOS"

    #### screen
    
    ```bash
    # screen 已预装
    
    # 查找串口设备
    ls /dev/tty.*
    # 通常是 /dev/tty.usbserial-* 或 /dev/tty.usbmodem*
    
    # 使用 screen
    screen /dev/tty.usbserial-1234 115200
    
    # screen 快捷键
    # Ctrl+A K: 退出
    # Ctrl+A D: 分离会话
    ```
    
    #### minicom
    
    ```bash
    # 使用 Homebrew 安装
    brew install minicom
    
    # 使用 minicom
    minicom -D /dev/tty.usbserial-1234 -b 115200
    ```


### 查找串口设备

=== "Linux"

    ```bash
    # 列出所有串口设备
    ls /dev/tty*
    
    # 查找 USB 串口
    ls /dev/ttyUSB*
    ls /dev/ttyACM*
    
    # 查看串口详细信息
    dmesg | grep tty
    
    # 使用 udevadm 查看设备信息
    udevadm info -a -n /dev/ttyUSB0
    ```

=== "Windows"

    ```powershell
    # 使用设备管理器
    # Win+X -> 设备管理器 -> 端口(COM 和 LPT)
    
    # 使用 PowerShell
    Get-WmiObject Win32_SerialPort | Select-Object Name, DeviceID
    
    # 或使用 mode 命令
    mode
    ```

=== "macOS"

    ```bash
    # 列出所有串口设备
    ls /dev/tty.*
    
    # 查看 USB 设备信息
    system_profiler SPUSBDataType
    ```

## 工具安装指南

### Zephyr SDK 安装

Zephyr SDK 包含了编译 Zephyr 所需的工具链和调试工具。

=== "Ubuntu/Debian"

    ```bash
    # 安装依赖
    sudo apt-get update
    sudo apt-get install --no-install-recommends git cmake ninja-build gperf \
      ccache dfu-util device-tree-compiler wget \
      python3-dev python3-pip python3-setuptools python3-tk python3-wheel xz-utils file \
      make gcc gcc-multilib g++-multilib libsdl2-dev libmagic1
    
    # 下载 Zephyr SDK
    cd ~
    wget https://github.com/zephyrproject-rtos/sdk-ng/releases/download/v0.16.5/zephyr-sdk-0.16.5_linux-x86_64.tar.xz
    
    # 解压
    tar xvf zephyr-sdk-0.16.5_linux-x86_64.tar.xz
    
    # 运行安装脚本
    cd zephyr-sdk-0.16.5
    ./setup.sh
    
    # 注册 Zephyr SDK
    sudo cp ~/zephyr-sdk-0.16.5/sysroots/x86_64-pokysdk-linux/usr/share/openocd/contrib/60-openocd.rules /etc/udev/rules.d
    sudo udevadm control --reload
    ```

=== "Windows"

    ```powershell
    # 安装 Chocolatey（如果尚未安装）
    # 以管理员身份运行 PowerShell
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    
    # 安装依赖工具
    choco install cmake --installargs 'ADD_CMAKE_TO_PATH=System'
    choco install ninja gperf python git dtc-msys2 wget 7zip
    
    # 下载 Zephyr SDK
    cd ~
    wget https://github.com/zephyrproject-rtos/sdk-ng/releases/download/v0.16.5/zephyr-sdk-0.16.5_windows-x86_64.7z
    
    # 解压（使用 7-Zip）
    7z x zephyr-sdk-0.16.5_windows-x86_64.7z
    
    # 运行安装脚本
    cd zephyr-sdk-0.16.5
    .\setup.cmd
    ```

=== "macOS"

    ```bash
    # 安装 Homebrew（如果尚未安装）
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # 安装依赖
    brew install cmake ninja gperf python3 ccache qemu dtc wget libmagic
    
    # 下载 Zephyr SDK
    cd ~
    wget https://github.com/zephyrproject-rtos/sdk-ng/releases/download/v0.16.5/zephyr-sdk-0.16.5_macos-x86_64.tar.xz
    # 或者 ARM Mac
    # wget https://github.com/zephyrproject-rtos/sdk-ng/releases/download/v0.16.5/zephyr-sdk-0.16.5_macos-aarch64.tar.xz
    
    # 解压
    tar xvf zephyr-sdk-0.16.5_macos-*.tar.xz
    
    # 运行安装脚本
    cd zephyr-sdk-0.16.5
    ./setup.sh
    ```

!!! warning "SDK 版本"
    上述示例使用的是 v0.16.5 版本。请访问 [Zephyr SDK Releases](https://github.com/zephyrproject-rtos/sdk-ng/releases) 查看最新版本并相应调整命令。


## 故障排除

在使用这些工具时，你可能会遇到一些常见问题。以下是一些解决方案。

### 问题 1：串口权限不足（Linux）

**症状**：
```
minicom: cannot open /dev/ttyUSB0: Permission denied
```

**解决方案**：

```bash
# 方法 1：将用户添加到 dialout 组
sudo usermod -a -G dialout $USER
# 注销并重新登录以使更改生效

# 方法 2：临时更改权限（不推荐）
sudo chmod 666 /dev/ttyUSB0

# 验证权限
ls -l /dev/ttyUSB0
groups  # 查看当前用户所属的组
```

### 问题 2：GDB 无法连接到目标

**症状**：
```
Remote communication error.  Target disconnected.: Connection reset by peer.
```

**解决方案**：

```bash
# 1. 确认 GDB Server 正在运行
# 对于 J-Link
JLinkGDBServer -device <device> -if SWD -speed 4000

# 对于 OpenOCD
openocd -f interface/stlink.cfg -f target/stm32f4x.cfg

# 2. 检查端口是否被占用
netstat -an | grep 2331  # J-Link 默认端口
netstat -an | grep 3333  # OpenOCD 默认端口

# 3. 确认目标设备已连接
# J-Link
JLinkExe
> connect

# OpenOCD
telnet localhost 4444
> targets

# 4. 检查防火墙设置
# Linux
sudo ufw status
sudo ufw allow 2331
sudo ufw allow 3333

# Windows
# 在 Windows 防火墙中允许相应端口
```


### 问题 3：west 命令找不到

**症状**：
```bash
west: command not found
```

**解决方案**：

=== "Linux/macOS"

    ```bash
    # 1. 确认 west 已安装
    pip3 list | grep west
    
    # 2. 如果未安装，安装 west
    pip3 install --user west
    
    # 3. 确认 Python 用户脚本目录在 PATH 中
    echo $PATH | grep ".local/bin"
    
    # 4. 如果不在 PATH 中，添加到 ~/.bashrc 或 ~/.zshrc
    echo 'export PATH=$HOME/.local/bin:$PATH' >> ~/.bashrc
    source ~/.bashrc
    
    # 5. 验证安装
    west --version
    ```

=== "Windows"

    ```powershell
    # 1. 确认 west 已安装
    pip list | Select-String west
    
    # 2. 如果未安装，安装 west
    pip install west
    
    # 3. 确认 Python Scripts 目录在 PATH 中
    $env:PATH -split ';' | Select-String Scripts
    
    # 4. 如果不在 PATH 中，添加到系统环境变量
    # 通常是 C:\Users\<用户名>\AppData\Local\Programs\Python\Python3x\Scripts
    # 或 C:\Python3x\Scripts
    
    # 5. 验证安装
    west --version
    ```

### 问题 4：J-Link 设备未识别（Windows）

**症状**：
```
Cannot connect to J-Link via USB.
```

**解决方案**：

```powershell
# 1. 检查设备管理器
# Win+X -> 设备管理器
# 查看是否有未识别的设备或驱动问题

# 2. 重新安装 J-Link 驱动
# 下载最新的 J-Link 软件包并重新安装
# https://www.segger.com/downloads/jlink/

# 3. 尝试不同的 USB 端口
# 使用 USB 2.0 端口而不是 USB 3.0

# 4. 检查 J-Link 固件
# 启动 J-Link Commander
JLink.exe
> ShowEmuList
# 如果提示固件更新，按照提示更新
```

### 问题 5：OpenOCD 找不到配置文件

**症状**：
```
Error: Can't find interface/stlink.cfg
```

**解决方案**：

```bash
# 1. 查找 OpenOCD 配置文件位置
# Linux
dpkg -L openocd | grep scripts

# macOS
brew list openocd | grep scripts

# Windows
# 通常在 <OpenOCD安装目录>/scripts/

# 2. 使用完整路径
openocd -f /usr/share/openocd/scripts/interface/stlink.cfg \
        -f /usr/share/openocd/scripts/target/stm32f4x.cfg

# 3. 或设置环境变量
export OPENOCD_SCRIPTS=/usr/share/openocd/scripts
openocd -f interface/stlink.cfg -f target/stm32f4x.cfg

# 4. 或在项目目录创建配置文件
# 创建 openocd.cfg
source [find interface/stlink.cfg]
source [find target/stm32f4x.cfg]

# 然后直接运行
openocd
```


### 问题 6：Git 克隆速度慢或失败（中国大陆）

**症状**：
```
fatal: unable to access 'https://github.com/...': Failed to connect to github.com
```

**解决方案**：

```bash
# 方法 1：使用 GitHub 镜像站
# Gitee 镜像（部分仓库）
git clone https://gitee.com/mirrors/zephyr.git

# 方法 2：配置代理（如果有）
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy https://127.0.0.1:7890

# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy

# 方法 3：使用 SSH 而不是 HTTPS
# 配置 SSH 密钥后
git clone git@github.com:zephyrproject-rtos/zephyr.git

# 方法 4：增加 Git 缓冲区大小
git config --global http.postBuffer 524288000

# 方法 5：使用浅克隆（只克隆最近的提交）
git clone --depth 1 https://github.com/zephyrproject-rtos/zephyr.git
```

## 学习建议

掌握这些工具需要时间和实践。以下是一些学习建议：

1. **从基础开始**：先熟悉命令行基本操作，再学习高级工具
2. **多动手实践**：工具的使用需要大量练习，不要只看不做
3. **查阅文档**：遇到问题时，先查阅官方文档和帮助信息
4. **使用快捷键**：熟练使用快捷键可以大大提高效率
5. **建立工具链**：将多个工具组合使用，形成高效的工作流程
6. **记录常用命令**：创建自己的命令备忘录或脚本

!!! tip "工具学习资源"
    - **Git**：[Pro Git 中文版](https://git-scm.com/book/zh/v2)
    - **GDB**：[GDB 官方文档](https://sourceware.org/gdb/documentation/)
    - **命令行**：[Linux Command Line](https://linuxcommand.org/)
    - **J-Link**：[SEGGER Wiki](https://wiki.segger.com/)
    - **OpenOCD**：[OpenOCD 用户指南](http://openocd.org/doc/html/index.html)

## 下一步

完成基础工具能力的学习后，你已经具备了开始 Zephyr 开发的工具基础。接下来，你可以：

- 进入 [第一阶段：入门筑基期](../stage1-foundation/index.md)，开始学习 Zephyr RTOS
- 回顾 [前置必备知识](index.md)，确保所有基础知识都已掌握
- 查看 [学习黄金法则](../learning-principles/index.md)，了解高效的学习方法

!!! success "检查清单"
    在进入下一阶段之前，确保你能够：
    
    - [ ] 使用 Git 克隆仓库、提交代码和管理分支
    - [ ] 熟练使用命令行进行文件操作和系统管理
    - [ ] 使用 GDB 设置断点、查看变量和调用栈
    - [ ] 配置和使用至少一种硬件调试器（J-Link 或 OpenOCD）
    - [ ] 使用串口工具查看设备输出
    - [ ] 成功安装 Zephyr SDK 和相关工具链
