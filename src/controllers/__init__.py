import os, glob

def publicize_python_files():
    files = glob.glob(os.path.dirname(__file__) + '/*.py')
    files_without_python_extensions = map(lambda f: os.path.basename(f)[:-3], files)
    return list(files_without_python_extensions)

__all__ = publicize_python_files()