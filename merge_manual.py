# merge_manual.py - Merges Experiments 1 to 10 into one master lab manual PDF
import os
import re
import subprocess

REPORTS_DIR = r"C:\Users\tanuj\.gemini\antigravity\scratch\pet-care-management-system\WT_Practical_Reports"
EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
TEMP_PROFILE = os.path.join(os.environ.get("TEMP", r"C:\Users\tanuj\AppData\Local\Temp"), "edge_pdf_batch_profile")

combined_body = ""
base_css = ""

for i in range(1, 11):
    html_file = os.path.join(REPORTS_DIR, f"Experiment_{i:02d}.html")
    if not os.path.exists(html_file):
        continue
    with open(html_file, "r", encoding="utf-8") as f:
        content = f.read()
    if not base_css:
        css_match = re.search(r"<style>(.*?)</style>", content, re.DOTALL)
        if css_match:
            base_css = css_match.group(1)
    body_match = re.search(r"<body>(.*?)</body>", content, re.DOTALL)
    if body_match:
        page_break = "page-break-before: always;" if i > 1 else ""
        combined_body += f"<div class='exp-section' style='{page_break}'>{body_match.group(1)}</div>\n"

master_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Web Lab (Course Code: 2345117) - Experiments 1 to 10 Practical Manual</title>
    <style>
{base_css}
    </style>
</head>
<body>
{combined_body}
</body>
</html>"""

master_html_path = os.path.join(REPORTS_DIR, "All_10_Experiments_Complete_Manual.html")
master_pdf_path = os.path.join(REPORTS_DIR, "All_10_Experiments_Complete_Manual.pdf")

with open(master_html_path, "w", encoding="utf-8") as f:
    f.write(master_html)

print(f"Master HTML written ({len(master_html)} bytes). Converting to PDF...")

cmd = [
    EDGE_PATH,
    "--headless",
    "--disable-gpu",
    f"--user-data-dir={TEMP_PROFILE}",
    "--no-pdf-header-footer",
    f"--print-to-pdf={master_pdf_path}",
    master_html_path
]

res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

if os.path.exists(master_pdf_path) and os.path.getsize(master_pdf_path) > 0:
    size_mb = os.path.getsize(master_pdf_path) / (1024 * 1024)
    print(f"[OK] Master PDF generated successfully: {master_pdf_path} ({size_mb:.2f} MB)")
else:
    print(f"[FAIL] Failed with exit code {res.returncode}")
    print(res.stderr)
