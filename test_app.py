import sys
import traceback

try:
    import app
    print("App imported successfully!")
except Exception as e:
    print(f"Error importing app: {type(e).__name__}: {e}")
    traceback.print_exc()
    sys.exit(1)