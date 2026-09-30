# build_clean_software_1_to_10.py
# Generates pristine, mistake-free WT practical reports for Experiments 1 to 10
# Complies 100% with the reference format:
# - Times New Roman, 12pt body, 14pt headings (bold & underlined)
# - Justified paragraphs with 1.5 line spacing
# - NO oversized college heading banner (clean single top line)
# - NO markdown backticks or weird regex escape artifacts in prose
# - Theory includes Pet Care Management System case study + Functions and Methods Used
# - Methodology included
# - Detailed 10-12 step procedure
# - Code snippet block
# - 8 to 10 output figures with Figure X.Y Heading and explanation paragraphs
# - Conclusion of 7-8+ lines
# - Outputs directly to 'software 1-10' folder

import os
import subprocess
import time

OUTPUT_DIR = r"C:\Users\tanuj\.gemini\antigravity\scratch\pet-care-management-system\software 1-10"
os.makedirs(OUTPUT_DIR, exist_ok=True)

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(EDGE_PATH):
    EDGE_PATH = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

TEMP_PROFILE = os.path.join(os.environ.get("TEMP", r"C:\Users\tanuj\AppData\Local\Temp"), "edge_clean_pdf_profile")

CSS_STYLES = """
@page {
    size: A4;
    margin: 20mm 20mm 20mm 20mm;
}
body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    color: #000000;
    text-align: justify;
    text-justify: inter-word;
    background: #ffffff;
    margin: 0;
    padding: 0;
}
.top-header {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    font-weight: bold;
    border-bottom: 1px dotted #333333;
    padding-bottom: 4px;
    margin-bottom: 14px;
    display: flex;
    justify-content: space-between;
}
h2.exp-title {
    font-family: 'Times New Roman', Times, serif;
    font-size: 14pt;
    font-weight: bold;
    text-decoration: underline;
    margin-top: 10px;
    margin-bottom: 12px;
    line-height: 1.4;
}
.section-label {
    font-family: 'Times New Roman', Times, serif;
    font-size: 13pt;
    font-weight: bold;
    text-decoration: underline;
    margin-top: 14px;
    margin-bottom: 6px;
    display: block;
}
p {
    font-size: 12pt;
    line-height: 1.5;
    text-align: justify;
    text-justify: inter-word;
    margin-top: 0;
    margin-bottom: 8px;
}
ul, ol {
    font-size: 12pt;
    line-height: 1.5;
    margin-top: 4px;
    margin-bottom: 12px;
    padding-left: 28px;
    text-align: justify;
}
li {
    margin-bottom: 5px;
}
.code-container {
    font-family: 'Courier New', Courier, monospace;
    font-size: 9.5pt;
    line-height: 1.35;
    background: #fafafa;
    border: 1px solid #777777;
    padding: 10px 14px;
    margin: 10px 0 14px 0;
    white-space: pre-wrap;
    word-break: break-word;
    page-break-inside: avoid;
}
.mockup-box {
    border: 1px solid #444444;
    border-radius: 4px;
    overflow: hidden;
    margin: 12px 0 6px 0;
    background: #ffffff;
    page-break-inside: avoid;
    box-sizing: border-box;
    width: 100%;
}
.mockup-bar-browser {
    background: #e5e7eb;
    border-bottom: 1px solid #9ca3af;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: Arial, sans-serif;
    font-size: 9pt;
}
.circle-dots {
    display: flex;
    gap: 4px;
}
.c-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    display: inline-block;
}
.c-red { background: #ef4444; }
.c-yellow { background: #f59e0b; }
.c-green { background: #10b981; }
.url-text {
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    padding: 1px 12px;
    flex-grow: 1;
    color: #374151;
    font-size: 8.5pt;
}
.mockup-bar-postman {
    background: #1e293b;
    color: #f8fafc;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: Arial, sans-serif;
    font-size: 9pt;
    font-weight: bold;
}
.mockup-bar-term {
    background: #1f2428;
    color: #e1e4e8;
    padding: 5px 10px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 9pt;
    border-bottom: 1px solid #444444;
}
.mockup-inner {
    padding: 10px 12px;
    background: #ffffff;
    font-family: Arial, sans-serif;
    box-sizing: border-box;
}
.term-inner {
    background: #121212;
    color: #00ff66;
    padding: 10px 12px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 9.5pt;
    line-height: 1.35;
    white-space: pre-wrap;
    box-sizing: border-box;
}
.postman-inner {
    background: #0f172a;
    color: #e2e8f0;
    padding: 10px 12px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 9pt;
    line-height: 1.35;
    white-space: pre-wrap;
    box-sizing: border-box;
}
.fig-caption {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    font-weight: bold;
    text-align: center;
    margin-top: 6px;
    margin-bottom: 3px;
    text-decoration: underline;
}
.fig-text {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    text-align: justify;
    text-justify: inter-word;
    margin-top: 0;
    margin-bottom: 14px;
}
.conclusion-p {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    text-align: justify;
    text-justify: inter-word;
    margin-bottom: 8px;
}
"""

def make_browser(url, body_html):
    return f"""
    <div class="mockup-box">
        <div class="mockup-bar-browser">
            <div class="circle-dots">
                <span class="c-dot c-red"></span>
                <span class="c-dot c-yellow"></span>
                <span class="c-dot c-green"></span>
            </div>
            <div class="url-text">{url}</div>
        </div>
        <div class="mockup-inner">
            {body_html}
        </div>
    </div>
    """

def make_term(title, text):
    return f"""
    <div class="mockup-box">
        <div class="mockup-bar-term">Console: {title}</div>
        <div class="term-inner">{text}</div>
    </div>
    """

def make_postman(method, endpoint, status_code, time_ms, body_text):
    status_color = "#22c55e" if "20" in status_code else ("#ef4444" if "40" in status_code else "#38bdf8")
    return f"""
    <div class="mockup-box">
        <div class="mockup-bar-postman">
            <div><span style="color:#ff6c37; margin-right:6px;">POSTMAN</span> | <span style="color:#38bdf8;">{method}</span> {endpoint}</div>
            <div>Status: <span style="color:{status_color}; font-weight:bold;">{status_code}</span> | {time_ms}</div>
        </div>
        <div class="postman-inner">{body_text}</div>
    </div>
    """

def make_fig_block(fig_num, title, explanation, mockup):
    return f"""
    <div style="page-break-inside: avoid; margin-bottom: 12px;">
        {mockup}
        <div class="fig-caption">Figure {fig_num} {title}</div>
        <div class="fig-text">{explanation}</div>
    </div>
    """

def render_doc(exp_num, title, aim, tools, theory_p, method_p, proc_steps, code_snippets, figures, conclusion_p):
    tools_li = "".join([f"<li>{t}</li>" for t in tools])
    theory_html = "".join([f"<p>{p}</p>" for p in theory_p])
    method_html = "".join([f"<p>{m}</p>" for m in method_p])
    proc_li = "".join([f"<li>{s}</li>" for s in proc_steps])
    
    code_html = ""
    for c_file, c_code in code_snippets:
        code_html += f"<div style='font-family: Times New Roman, serif; font-size:11pt; font-weight:bold; margin-top:6px;'>// File: {c_file}</div><div class='code-container'>{c_code}</div>"
        
    figs_html = "".join([make_fig_block(f["num"], f["title"], f["desc"], f["mockup"]) for f in figures])
    conc_html = "".join([f"<p class='conclusion-p'>{cp}</p>" for cp in conclusion_p])
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Experiment {exp_num} - {title}</title>
    <style>
{CSS_STYLES}
    </style>
</head>
<body>
    <div class="top-header">
        <span>TANUJ SHARMA – 3505</span>
        <span>COURSE CODE: 2345117 (WEB LAB)</span>
    </div>

    <h2 class="exp-title">Experiment No. {exp_num} - {title}</h2>

    <p><u><b>Aim:</b></u> {aim}</p>

    <span class="section-label">Tools Used:</span>
    <ul>
        {tools_li}
    </ul>

    <span class="section-label">Theory:</span>
    {theory_html}

    <span class="section-label">Methodology:</span>
    {method_html}

    <span class="section-label">Procedure:</span>
    <ol>
        {proc_li}
    </ol>

    <span class="section-label">Code :</span>
    {code_html}

    <span class="section-label">Output:</span>
    {figs_html}

    <span class="section-label">Conclusion:</span>
    {conc_html}
</body>
</html>"""
    return html

print("Core generator definitions ready.")
