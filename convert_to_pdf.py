# convert_to_pdf.py - Converts all 12 HTML experiment reports to PDF using Microsoft Edge headless
import os
import subprocess
import time

REPORTS_DIR = r"C:\Users\tanuj\.gemini\antigravity\scratch\pet-care-management-system\WT_Practical_Reports"
EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
TEMP_PROFILE = os.path.join(os.environ.get("TEMP", r"C:\Users\tanuj\AppData\Local\Temp"), "edge_pdf_batch_profile")

if not os.path.exists(EDGE_PATH):
    # Try 64-bit program files path if x86 is missing
    EDGE_PATH = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

print(f"Using Microsoft Edge binary: {EDGE_PATH}")
print(f"Reports Directory: {REPORTS_DIR}")

successful_conversions = []

for i in range(1, 13):
    html_name = f"Experiment_{i:02d}.html"
    pdf_name = f"Experiment_{i:02d}.pdf"
    
    html_path = os.path.join(REPORTS_DIR, html_name)
    pdf_path = os.path.join(REPORTS_DIR, pdf_name)
    
    if not os.path.exists(html_path):
        print(f"[MISSING] HTML file not found: {html_name}")
        continue
        
    print(f"Converting {html_name} -> {pdf_name}...")
    
    # Run Edge headless print-to-pdf
    cmd = [
        EDGE_PATH,
        "--headless",
        "--disable-gpu",
        f"--user-data-dir={TEMP_PROFILE}",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}",
        html_path
    ]
    
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    # Check if PDF was produced
    if os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 0:
        size_kb = os.path.getsize(pdf_path) / 1024
        print(f"  [OK] Success: {pdf_name} ({size_kb:.1f} KB)")
        successful_conversions.append((pdf_name, size_kb, pdf_path))
    else:
        print(f"  [FAIL] Failed to generate {pdf_name}. Exit code: {res.returncode}")
        print("  Stderr:", res.stderr)
        
    # Small pause to release lock on temporary profile
    time.sleep(0.5)

print("\n================== SUMMARY ==================")
print(f"Successfully generated {len(successful_conversions)} of 12 experiment PDFs:")
for name, size, path in successful_conversions:
    print(f" - {name} ({size:.1f} KB) -> {path}")
