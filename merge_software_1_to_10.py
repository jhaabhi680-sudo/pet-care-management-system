# merge_software_1_to_10.py
import os
import re
import subprocess

folder = r"C:\Users\tanuj\.gemini\antigravity\scratch\pet-care-management-system\software 1-10"
edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
temp_profile = os.path.join(os.environ.get("TEMP", r"C:\Users\tanuj\AppData\Local\Temp"), "edge_clean_pdf_profile")

combined_body = ""
css = ""

for i in range(1, 11):
    f_html = os.path.join(folder, f"Experiment_{i:02d}.html")
    if os.path.exists(f_html):
        with open(f_html, "r", encoding="utf-8") as f:
            txt = f.read()
        if not css:
            m_css = re.search(r"<style>(.*?)</style>", txt, re.DOTALL)
            if m_css:
                css = m_css.group(1)
        m_b = re.search(r"<body>(.*?)</body>", txt, re.DOTALL)
        if m_b:
            p_break = "page-break-before: always;" if i > 1 else ""
            combined_body += f"<div style='{p_break}'>{m_b.group(1)}</div>\n"

full_html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Web Lab Manual - Experiments 1 to 10</title>
    <style>
{css}
    </style>
</head>
<body>
{combined_body}
</body>
</html>"""

master_html_path = os.path.join(folder, "All_10_Experiments_Combined_Manual.html")
master_pdf_path = os.path.join(folder, "All_10_Experiments_Combined_Manual.pdf")

with open(master_html_path, "w", encoding="utf-8") as f:
    f.write(full_html)

cmd = [
    edge,
    "--headless",
    "--disable-gpu",
    f"--user-data-dir={temp_profile}",
    "--no-pdf-header-footer",
    f"--print-to-pdf={master_pdf_path}",
    master_html_path
]
subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
if os.path.exists(master_pdf_path) and os.path.getsize(master_pdf_path) > 0:
    print(f"[OK] Master combined manual: {master_pdf_path} ({os.path.getsize(master_pdf_path)/1024:.1f} KB)")
