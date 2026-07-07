import os
import subprocess
import sys
import shutil

def run_command(command, cwd=None):
    print(f"\n[BUILD] Running: {command} (in {cwd or os.getcwd()})")
    process = subprocess.Popen(command, shell=True, cwd=cwd)
    process.communicate()
    if process.returncode != 0:
        print(f"[BUILD ERROR] Command failed with exit code {process.returncode}")
        sys.exit(process.returncode)

def main():
    base_dir = os.path.abspath(os.path.dirname(__file__))
    frontend_dir = os.path.join(base_dir, "frontend")
    dist_dir = os.path.join(frontend_dir, "dist")
    
    # Step 1: Build the React frontend
    print("\n" + "="*50)
    print("STEP 1: Compiling Frontend (Vite)")
    print("="*50)
    if os.path.exists(dist_dir):
        shutil.rmtree(dist_dir)
    run_command("npm install", cwd=frontend_dir)
    run_command("npm run build", cwd=frontend_dir)
    
    if not os.path.exists(dist_dir):
        print("[BUILD ERROR] Frontend build failed. No dist directory found.")
        sys.exit(1)
        
    # Step 2: Build the Python backend using PyInstaller
    print("\n" + "="*50)
    print("STEP 2: Compiling Backend (PyInstaller)")
    print("="*50)
    
    # Ensure pyinstaller is installed in the active environment (e.g. .venv)
    run_command(f'"{sys.executable}" -m pip install pyinstaller')
    
    # We use ; as the separator on Windows for --add-data
    separator = ";" if sys.platform == "win32" else ":"
    frontend_data_arg = f"{dist_dir}{separator}frontend_production"
    
    # The entry point is backend/production.py
    entry_point = os.path.join(base_dir, "backend", "production.py")
    
    # PyInstaller command using sys.executable to strictly enforce the .venv
    pyinstaller_cmd = (
        f'"{sys.executable}" -m PyInstaller --noconfirm --onefile --windowed '
        f'--name "GravityBlu" '
        f'--add-data "{frontend_data_arg}" '
        f'--add-binary "ffmpeg{separator}ffmpeg" '
        f'--hidden-import "dns" '
        f'"{entry_point}"'
    )
    run_command(pyinstaller_cmd, cwd=base_dir)
    
    print("\n" + "="*50)
    print("BUILD SUCCESSFUL!")
    print(f"Your compiled application is located in: {os.path.join(base_dir, 'dist')}")
    print("="*50)

if __name__ == "__main__":
    main()
