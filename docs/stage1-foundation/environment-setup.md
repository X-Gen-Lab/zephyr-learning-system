# 开发环境搭建

本章节将指导你完成 Zephyr RTOS 开发环境的完整搭建过程。无论你使用 Windows、Linux 还是 macOS，都能找到对应的详细步骤。

!!! tip "视频教程"
    如果你更喜欢通过视频学习，可以观看我们的环境搭建视频教程：
    
    <!-- 视频教程占位符 - 待添加实际视频链接 -->
    <!-- 
    <iframe width="100%" height="500" 
            src="https://www.youtube.com/embed/VIDEO_ID" 
            title="Zephyr RTOS 环境搭建教程" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
    </iframe>
    -->
    
    视频教程将演示完整的安装过程，包括常见问题的解决方法。

## 系统要求

### 硬件要求

| 组件 | 最低要求 | 推荐配置 |
|------|---------|---------|
| CPU | 双核 2.0 GHz | 四核 2.5 GHz 及以上 |
| 内存 | 4 GB RAM | 8 GB RAM 及以上 |
| 硬盘 | 20 GB 可用空间 | 50 GB 可用空间（SSD） |
| 开发板 | 可选（可使用 QEMU 模拟器） | Nordic nRF52840 DK / STM32 Nucleo |

### 软件要求

=== "Ubuntu 20.04/22.04"

    - Python 3.8 或更高版本
    - CMake 3.20.0 或更高版本
    - Git 2.25 或更高版本
    - Device Tree Compiler (dtc)
    - GNU Make
    - Ninja Build System

=== "Windows 10/11"

    - Python 3.8 或更高版本
    - CMake 3.20.0 或更高版本
    - Git for Windows 2.25 或更高版本
    - Windows Terminal（推荐）
    - 7-Zip 或其他解压工具

=== "macOS 11+（Big Sur 及以上）"

    - Python 3.8 或更高版本
    - CMake 3.20.0 或更高版本
    - Git 2.25 或更高版本
    - Xcode Command Line Tools
    - Homebrew 包管理器

## 安装步骤

### 第一步：安装依赖工具

=== "Ubuntu"

    ```bash
    # 更新软件包列表
    sudo apt update
    
    # 安装必要的依赖工具
    sudo apt install -y git cmake ninja-build gperf \
      ccache dfu-util device-tree-compiler wget \
      python3-dev python3-pip python3-setuptools python3-tk python3-wheel \
      xz-utils file make gcc gcc-multilib g++-multilib libsdl2-dev \
      libmagic1
    
    # 验证安装
    cmake --version
    python3 --version
    git --version
    ```

=== "Windows"

    ```powershell
    # 使用 Chocolatey 包管理器安装（推荐）
    # 首先安装 Chocolatey（以管理员身份运行 PowerShell）
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    
    # 安装依赖工具
    choco install -y cmake --installargs 'ADD_CMAKE_TO_PATH=System'
    choco install -y ninja gperf python git dtc-msys2 wget 7zip
    
    # 验证安装
    cmake --version
    python --version
    git --version
    ```

    !!! tip "手动安装"
        如果不想使用 Chocolatey，可以从以下官网下载安装包：
        
        - [Python](https://www.python.org/downloads/)（安装时勾选"Add Python to PATH"）
        - [CMake](https://cmake.org/download/)
        - [Git for Windows](https://git-scm.com/download/win)

=== "macOS"

    ```bash
    # 安装 Xcode Command Line Tools
    xcode-select --install
    
    # 安装 Homebrew（如果尚未安装）
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # 安装依赖工具
    brew install cmake ninja gperf python3 ccache qemu dtc wget
    
    # 验证安装
    cmake --version
    python3 --version
    git --version
    ```

### 第二步：安装 west 工具

West 是 Zephyr 的元工具，用于管理多仓库项目、构建和烧录。

```bash
# 使用 pip 安装 west
pip3 install --user -U west

# 验证安装
west --version
```

!!! success "预期输出"
    ```
    West version: v1.2.0
    ```

**配置 PATH 环境变量**

=== "Linux/macOS"

    ```bash
    # 将用户 Python 包路径添加到 PATH
    echo 'export PATH=$HOME/.local/bin:$PATH' >> ~/.bashrc
    source ~/.bashrc
    
    # 或者对于 macOS 使用 zsh
    echo 'export PATH=$HOME/.local/bin:$PATH' >> ~/.zshrc
    source ~/.zshrc
    ```

=== "Windows"

    West 通常会自动添加到 PATH。如果 `west --version` 命令失败，手动添加：
    
    1. 打开"系统属性" → "高级" → "环境变量"
    2. 在"用户变量"中找到 `Path`
    3. 添加 `%APPDATA%\Python\Python3X\Scripts`（将 3X 替换为你的 Python 版本）

### 第三步：初始化 Zephyr 工作区

```bash
# 创建工作目录
mkdir ~/zephyrproject
cd ~/zephyrproject

# 初始化 west 工作区（使用 Zephyr 主分支）
west init -m https://github.com/zephyrproject-rtos/zephyr

# 更新所有模块（这一步会下载 Zephyr 及其依赖）
west update
```

!!! warning "网络问题和国内镜像"
    `west update` 需要从 GitHub 下载大量代码，可能需要 10-30 分钟。如果遇到网络问题：
    
    **方案 1：使用代理**
    ```bash
    # 配置 Git 代理（假设代理地址为 127.0.0.1:7890）
    git config --global http.proxy http://127.0.0.1:7890
    git config --global https.proxy http://127.0.0.1:7890
    ```
    
    **方案 2：使用国内镜像（Gitee）**
    ```bash
    # 修改 .west/config 文件中的 remote URL
    # 将 github.com 替换为 gitee.com 对应的镜像地址
    ```
    
    **方案 3：分步下载**
    ```bash
    # 如果 west update 中断，可以重复执行直到成功
    west update
    ```

**导出 Zephyr CMake 包**

```bash
# 导出 Zephyr CMake 包（让 CMake 能找到 Zephyr）
west zephyr-export
```

### 第四步：安装 Python 依赖

```bash
# 进入 Zephyr 目录
cd ~/zephyrproject/zephyr

# 安装 Python 依赖包
pip3 install --user -r scripts/requirements.txt
```

!!! tip "虚拟环境（可选）"
    推荐使用 Python 虚拟环境隔离依赖：
    ```bash
    python3 -m venv ~/zephyrproject/.venv
    source ~/zephyrproject/.venv/bin/activate  # Linux/macOS
    # 或 Windows: ~/zephyrproject/.venv/Scripts/activate
    pip install -r scripts/requirements.txt
    ```

### 第五步：安装 Zephyr SDK

Zephyr SDK 包含编译器工具链和调试工具。

=== "Linux"

    ```bash
    # 下载 Zephyr SDK（以 0.16.5 版本为例）
    cd ~
    wget https://github.com/zephyrproject-rtos/sdk-ng/releases/download/v0.16.5/zephyr-sdk-0.16.5_linux-x86_64.tar.xz
    
    # 解压
    tar -xvf zephyr-sdk-0.16.5_linux-x86_64.tar.xz
    
    # 运行安装脚本
    cd zephyr-sdk-0.16.5
    ./setup.sh -t all -h -c
    
    # 注册 CMake 包
    sudo cp ~/zephyr-sdk-0.16.5/sysroots/x86_64-pokysdk-linux/usr/share/cmake/Zephyr-sdk/Zephyr-sdkConfig*.cmake \
      /usr/share/cmake-3.*/Modules/
    ```

=== "Windows"

    ```powershell
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
    # 下载 Zephyr SDK
    cd ~
    wget https://github.com/zephyrproject-rtos/sdk-ng/releases/download/v0.16.5/zephyr-sdk-0.16.5_macos-x86_64.tar.xz
    
    # 如果是 Apple Silicon (M1/M2)，下载 ARM64 版本
    # wget https://github.com/zephyrproject-rtos/sdk-ng/releases/download/v0.16.5/zephyr-sdk-0.16.5_macos-aarch64.tar.xz
    
    # 解压
    tar -xvf zephyr-sdk-0.16.5_macos-x86_64.tar.xz
    
    # 运行安装脚本
    cd zephyr-sdk-0.16.5
    ./setup.sh -t all -h -c
    ```

!!! info "SDK 版本说明"
    本教程使用 SDK 0.16.5 版本。请访问 [Zephyr SDK Releases](https://github.com/zephyrproject-rtos/sdk-ng/releases) 查看最新版本。

## 环境验证

### 编译 Hello World 示例

```bash
# 进入 Zephyr 目录
cd ~/zephyrproject/zephyr

# 编译 Hello World 示例（使用 QEMU 模拟器）
west build -p auto -b qemu_x86 samples/hello_world

# 运行示例
west build -t run
```

!!! success "成功标志"
    如果看到以下输出，说明环境搭建成功：
    ```
    *** Booting Zephyr OS build v3.6.0 ***
    Hello World! qemu_x86
    ```
    
    按 `Ctrl+A` 然后按 `X` 退出 QEMU。

### 编译真实硬件示例

如果你有开发板（以 Nordic nRF52840 DK 为例）：

```bash
# 编译 Blinky 示例
west build -p auto -b nrf52840dk_nrf52840 samples/basic/blinky

# 烧录到开发板（需要连接开发板）
west flash

# 查看串口输出
west debug
```

## 避坑指南

### 问题 1：Python 版本不兼容

!!! danger "症状"
    ```
    ERROR: Python 3.6 is not supported. Please use Python 3.8 or newer.
    ```

**解决方案**：

=== "Ubuntu"

    ```bash
    # 安装 Python 3.10
    sudo apt install python3.10 python3.10-venv python3.10-dev
    
    # 设置为默认版本
    sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.10 1
    ```

=== "Windows"

    从 [Python 官网](https://www.python.org/downloads/) 下载并安装 Python 3.10 或更高版本。

=== "macOS"

    ```bash
    # 使用 Homebrew 安装最新 Python
    brew install python@3.11
    brew link python@3.11
    ```

### 问题 2：west update 失败

!!! danger "症状"
    ```
    fatal: unable to access 'https://github.com/...': Failed to connect
    ```

**解决方案**：

**方案 1：重试**
```bash
# 多次执行直到成功
west update
```

**方案 2：配置 Git 代理**
```bash
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
```

**方案 3：使用 SSH 协议**
```bash
# 修改 .west/config，将 https:// 替换为 git@
# 例如：https://github.com/zephyrproject-rtos/zephyr
# 改为：git@github.com:zephyrproject-rtos/zephyr.git
```

### 问题 3：编译错误 - 找不到工具链

!!! danger "症状"
    ```
    CMake Error: Could not find toolchain file: zephyr/cmake/toolchain/zephyr/generic.cmake
    ```

**解决方案**：

```bash
# 确保已导出 Zephyr CMake 包
cd ~/zephyrproject/zephyr
west zephyr-export

# 设置环境变量（临时）
export ZEPHYR_BASE=~/zephyrproject/zephyr

# 或者添加到 ~/.bashrc（永久）
echo 'export ZEPHYR_BASE=~/zephyrproject/zephyr' >> ~/.bashrc
source ~/.bashrc
```

### 问题 4：权限问题（Linux）

!!! danger "症状"
    ```
    Permission denied when accessing /dev/ttyUSB0
    ```

**解决方案**：

```bash
# 将当前用户添加到 dialout 组
sudo usermod -a -G dialout $USER

# 注销并重新登录，或执行
newgrp dialout

# 验证权限
ls -l /dev/ttyUSB0
```

### 问题 5：Windows 路径过长

!!! danger "症状"
    ```
    Error: The system cannot find the path specified.
    ```

**解决方案**：

**方案 1：启用长路径支持**
```powershell
# 以管理员身份运行 PowerShell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
  -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

**方案 2：使用较短的工作目录**
```powershell
# 使用 C:\zephyr 而不是 C:\Users\YourName\Documents\zephyrproject
mkdir C:\zephyr
cd C:\zephyr
west init -m https://github.com/zephyrproject-rtos/zephyr
```

## 环境配置脚本

为了方便每次使用 Zephyr，可以创建环境激活脚本。

=== "Linux/macOS"

    创建 `~/zephyrproject/activate.sh`：
    
    ```bash
    #!/bin/bash
    
    # Zephyr 环境激活脚本
    
    export ZEPHYR_BASE=~/zephyrproject/zephyr
    export PATH=$HOME/.local/bin:$PATH
    
    # 如果使用虚拟环境
    if [ -d ~/zephyrproject/.venv ]; then
        source ~/zephyrproject/.venv/bin/activate
    fi
    
    echo "Zephyr 开发环境已激活"
    echo "ZEPHYR_BASE: $ZEPHYR_BASE"
    west --version
    ```
    
    **使用方法**：
    ```bash
    # 赋予执行权限
    chmod +x ~/zephyrproject/activate.sh
    
    # 每次开发前执行
    source ~/zephyrproject/activate.sh
    ```

=== "Windows"

    创建 `%USERPROFILE%\zephyrproject\activate.bat`：
    
    ```batch
    @echo off
    REM Zephyr 环境激活脚本
    
    set ZEPHYR_BASE=%USERPROFILE%\zephyrproject\zephyr
    
    REM 如果使用虚拟环境
    if exist %USERPROFILE%\zephyrproject\.venv\Scripts\activate.bat (
        call %USERPROFILE%\zephyrproject\.venv\Scripts\activate.bat
    )
    
    echo Zephyr 开发环境已激活
    echo ZEPHYR_BASE: %ZEPHYR_BASE%
    west --version
    ```
    
    **使用方法**：
    ```powershell
    # 每次开发前执行
    %USERPROFILE%\zephyrproject\activate.bat
    ```

## 下一步

恭喜！你已经成功搭建了 Zephyr RTOS 开发环境。接下来可以：

- 学习 [west 工具核心用法](west-tool.md)
- 了解 [工程结构与配置](project-structure.md)
- 开始 [基础例程实操](basic-examples.md)

!!! tip "保持环境更新"
    定期更新 Zephyr 和工具链：
    ```bash
    cd ~/zephyrproject
    west update
    pip3 install --user -U west
    ```
