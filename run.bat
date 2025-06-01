@echo off
setlocal

:: Caminhos absolutos (sem aspas nas variáveis)
set BACKEND_PATH=C:\Users\lucas\OneDrive\Desktop\Projetos\agrodel\Agrodel-backend
set FRONTEND_PATH=C:\Users\lucas\OneDrive\Desktop\Projetos\agrodel\Agrodel-frontend
set VENV_PATH=%BACKEND_PATH%\.venv
set PYTHON_EXEC=%VENV_PATH%\Scripts\python.exe

:: Rodar o back-end em uma nova janela
start "Back-end" cmd /k "cd /d %BACKEND_PATH% && call %VENV_PATH%\Scripts\activate && %PYTHON_EXEC% run.py"

:: Rodar o front-end em outra nova janela
start "Front-end" cmd /k "cd /d %FRONTEND_PATH% && npm run dev"

endlocal
