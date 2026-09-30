import os
import subprocess
import time

REPORTS_DIR = os.path.abspath("WT_Practical_Reports")
EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
TEMP_PROFILE = os.path.join(os.environ.get("TEMP", r"C:\Temp"), "edge_pdf_gen_profile")

print(f"Target Directory: {REPORTS_DIR}")
print(f"Edge Browser: {EDGE_PATH}")
