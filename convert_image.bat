@echo off
setlocal enabledelayedexpansion

set "INPUT_FOLDER=D:\Project\PhotoFlare\PhotoFlare\PhotoFlare\src\assets\org"
set "OUTPUT_FOLDER=D:\Project\PhotoFlare\PhotoFlare\PhotoFlare\src\assets\img"

rem List of target screen sizes (widths) in pixels
set "SCREEN_SIZES=320 480 640 800 960 1200 1600 1920"


for %%i in ("%INPUT_FOLDER%\*.jpg") do (
    set "filename=%%~ni"
    set "input_path=%%i"
    
    rem Create a WebP image for each screen size
    for %%s in (%SCREEN_SIZES%) do (
        set "output_path=!OUTPUT_FOLDER!\!filename!_%%s.webp"
        magick convert "!input_path!" -quality 80 -resize %%sx -define webp:lossless=false -define webp:method=6 "!output_path!"
        echo Converted: !input_path! -^> !output_path!
    )
)

endlocal
