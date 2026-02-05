@echo off
set "PATH=%PATH%;C:\Users\north\AppData\Local\Programs\Ollama"
set "PATH=%PATH%;C:\Users\north\AppData\Local\Python\pythoncore-3.14-64"
set "PATH=%PATH%;C:\Users\north\AppData\Local\Python\pythoncore-3.14-64\Scripts"

echo Generating Prisma Client...
prisma generate --schema "C:\Users\north\AppData\Local\Python\pythoncore-3.14-64\Lib\site-packages\litellm\proxy\schema.prisma"
pause
