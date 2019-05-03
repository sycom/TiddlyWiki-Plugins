@::!/launch/tiddlywiki
@echo off
goto :init

:header
    echo %__NAME% v%__VERSION%
    echo This batch file makes TW launching command lines shorter,
    echo Just say if you want to use node (default -n) or local version (-l)
    echo and tells edition (default "collection") and mode (default "server")
    echo.
    goto :eof

:usage
    echo USAGE:
    echo %__BAT_NAME% [flags] "edition" "mode"
    echo List of flags :
    echo.  /?, --help           shows this help
    echo.  /v, --version        shows the version
    echo.  /n, --node           will launch tw using npm installed version
    echo.  /l, --local          will launch tw using local version in ../TiddlyWiki5 folder
    echo parameters :
    echo.  - edition : one of the folder in editions
    echo.  - mode : server or build
    goto :eof

:version
    if "%~1"=="full" call :header & goto :eof
    echo %__VERSION%
    goto :eof

:missing_argument
    call :header
    call :usage
    echo.
    echo ****                                   ****
    echo ****    MISSING "REQUIRED ARGUMENT"    ****
    echo ****                                   ****
    echo.
    goto :eof

:init
    set "__NAME=%~n0"
    set "__VERSION=0.00"
    set "__YEAR=2019"

    set "__BAT_FILE=%~0"
    set "__BAT_PATH=%~dp0"
    set "__BAT_NAME=%~nx0"

    set "Edition="
    set "Mode="
    set "Flag="

:parse
    if "%~1"=="" goto :validate

    if /i "%~1"=="/?"         call :header & call :usage "%~2" & goto :end
    if /i "%~1"=="-?"         call :header & call :usage "%~2" & goto :end
    if /i "%~1"=="--help"     call :header & call :usage "%~2" & goto :end

    if /i "%~1"=="/v"         call :version      & goto :end
    if /i "%~1"=="-v"         call :version      & goto :end
    if /i "%~1"=="--version"  call :version full & goto :end

    if /i "%~1"=="/n"         set "Flag=node" & shift & goto :parse
    if /i "%~1"=="-n"         set "Flag=node" & shift & goto :parse
    if /i "%~1"=="--node"     set "Flag=node" & shift & goto :parse
    if /i "%~1"=="/l"         set "Flag=local" & shift & goto :parse
    if /i "%~1"=="-l"         set "Flag=local" & shift & goto :parse
    if /i "%~1"=="--local"    set "Flag=local" & shift & goto :parse

    if not defined Edition    set "Edition=%~1" & shift & goto :parse
    if not defined Mode       set "Mode=%~1" & shift & goto :parse

    shift
    goto :parse

:validate
    if not defined Flag    set "Flag=node" & shift & goto :parse
    if not defined Edition set "Edition=collection" & shift
    if not defined Mode set "Mode=server" & shift

    shift
    goto :%Flag%

:node
    echo launching tiddlywiki using npm installed version
    echo Edition: "%Edition%"

    if defined Mode     echo Mode: "%Mode%"
    if not defined Mode echo Mode: "%Mode%" (default)

    tiddlywiki ./editions/"%Edition%" --"%Mode%"

    goto :end

:local
    echo launching tiddlywiki using local version
    echo Edition: "%Edition%"

    if defined Mode     echo Mode: "%Mode%"
    if not defined Mode echo Mode: "%Mode%" (default)

    node ../tiddlywiki5/tiddlywiki.js ../TW5dev/editions/"%Edition%" --"%Mode%"

    goto :end

:end
    call :cleanup
    exit /B

:cleanup
    REM The cleanup function is only really necessary if you
    REM are _not_ using SETLOCAL.
    set "__NAME="
    set "__VERSION="
    set "__YEAR="

    set "__BAT_FILE="
    set "__BAT_PATH="
    set "__BAT_NAME="

    set "OptHelp="
    set "OptVersion="
    set "OptVerbose="

    set "UnNamedArgument="
    set "UnNamedArgument2="
    set "NamedFlag="

    goto :eof
