@echo off
REM Zephyr RTOS 学习系统构建脚本 (Windows)
REM 用于本地开发和生产构建

setlocal enabledelayedexpansion

REM 检查 Python 环境
:check_python
echo [INFO] 检查 Python 环境...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] 未找到 Python，请先安装 Python 3.8 或更高版本
    exit /b 1
)
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo [INFO] Python 版本: %PYTHON_VERSION%
goto :eof

REM 安装依赖
:install_dependencies
echo [INFO] 检查并安装依赖...

if not exist "venv" (
    echo [INFO] 创建虚拟环境...
    python -m venv venv
)

echo [INFO] 激活虚拟环境...
call venv\Scripts\activate.bat

echo [INFO] 安装 Python 依赖...
pip install -r requirements.txt --quiet

echo [INFO] 依赖安装完成
goto :eof

REM 验证配置文件
:validate_config
echo [INFO] 验证配置文件...

if not exist "mkdocs.yml" (
    echo [ERROR] 未找到 mkdocs.yml 配置文件
    exit /b 1
)

findstr /C:"site_name:" mkdocs.yml >nul
if errorlevel 1 (
    echo [ERROR] mkdocs.yml 缺少 site_name 字段
    exit /b 1
)

echo [INFO] 配置文件验证通过
goto :eof

REM 清理旧的构建文件
:clean_build
echo [INFO] 清理旧的构建文件...

if exist "site" (
    rmdir /s /q site
    echo [INFO] 已删除 site\ 目录
)
goto :eof

REM 本地开发服务器
:serve
call :check_python
call :validate_config

echo [INFO] 启动本地开发服务器...
echo [INFO] 访问 http://127.0.0.1:8000 查看网站
echo [INFO] 按 Ctrl+C 停止服务器

call venv\Scripts\activate.bat
mkdocs serve
goto :eof

REM 构建生产版本
:build
call :check_python
call :validate_config
call :clean_build

echo [INFO] 开始构建生产版本...

call venv\Scripts\activate.bat

REM 使用 --strict 模式，将警告视为错误
mkdocs build --strict
if errorlevel 1 (
    echo [ERROR] 构建失败，请检查错误信息
    exit /b 1
)

echo [INFO] 构建成功！
echo [INFO] 输出目录: site\

REM 显示构建统计
if exist "site" (
    for /f %%a in ('dir /s /b site ^| find /c /v ""') do set FILE_COUNT=%%a
    echo [INFO] 生成文件数: !FILE_COUNT!
)

call :validate_build
goto :eof

REM 验证构建结果
:validate_build
echo [INFO] 验证构建结果...

if not exist "site" (
    echo [ERROR] site\ 目录不存在，构建可能失败
    exit /b 1
)

REM 检查关键文件
set REQUIRED_FILES=index.html search\search_index.json sitemap.xml

for %%f in (%REQUIRED_FILES%) do (
    if not exist "site\%%f" (
        echo [ERROR] 缺少关键文件: %%f
        exit /b 1
    )
)

echo [INFO] 构建结果验证通过
goto :eof

REM 显示帮助信息
:show_help
echo Zephyr RTOS 学习系统构建脚本 (Windows)
echo.
echo 用法: build.bat [命令]
echo.
echo 命令:
echo   install     安装依赖
echo   serve       启动本地开发服务器（默认端口 8000）
echo   build       构建生产版本
echo   clean       清理构建文件
echo   validate    验证构建结果
echo   help        显示此帮助信息
echo.
echo 示例:
echo   build.bat install    # 首次使用时安装依赖
echo   build.bat serve      # 启动开发服务器
echo   build.bat build      # 构建生产版本
echo.
goto :eof

REM 主函数
if "%1"=="" goto show_help
if "%1"=="install" goto install_dependencies
if "%1"=="serve" goto serve
if "%1"=="build" goto build
if "%1"=="clean" goto clean_build
if "%1"=="validate" goto validate_build
if "%1"=="help" goto show_help
if "%1"=="--help" goto show_help
if "%1"=="-h" goto show_help

echo [ERROR] 未知命令: %1
call :show_help
exit /b 1
