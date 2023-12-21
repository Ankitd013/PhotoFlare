@echo off
setlocal enabledelayedexpansion

REM Set the input file and output directory
set input_file=D:\Project\PhotoFlare\PhotoFlare\pwa_icon.png
set output_directory=D:\Project\PhotoFlare\PhotoFlare\src\assets\icons

REM Create the output directory if it doesn't exist
if not exist "%output_directory%" mkdir "%output_directory%"

REM Sizes to generate
set sizes=72 96 128 144 152 192 384 512

REM Loop through each size and generate PNG
for %%s in (%sizes%) do (
    set output_file=!output_directory!\icon-%%sx%%s.png
    magick convert "%input_file%" -resize %%sx%%s -background none -gravity center -extent %%sx%%s "!output_file!"
    echo Generated: !output_file!
)

echo All PNGs generated successfully.
