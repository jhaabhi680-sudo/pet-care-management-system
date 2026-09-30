# generator_core.py - Core templates and mockup builders for WT Practical Reports
import os

BASE_CSS = """
@page {
    size: A4;
    margin: 18mm 18mm 18mm 18mm;
}
body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    color: #111;
    text-align: justify;
    background: #fff;
    margin: 0;
    padding: 0;
}
.header-box {
    text-align: center;
    border-bottom: 2px solid #222;
    padding-bottom: 8px;
    margin-bottom: 16px;
}
.header-college {
    font-size: 14pt;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.header-dept {
    font-size: 11pt;
    font-weight: bold;
    margin-top: 2px;
}
.header-meta {
    font-size: 10.5pt;
    margin-top: 2px;
    color: #333;
}
h2.exp-heading {
    font-family: 'Times New Roman', Times, serif;
    font-size: 14pt;
    font-weight: bold;
    text-decoration: underline;
    text-align: left;
    margin-top: 14px;
    margin-bottom: 12px;
    line-height: 1.4;
}
h3.section-heading {
    font-family: 'Times New Roman', Times, serif;
    font-size: 13pt;
    font-weight: bold;
    text-decoration: underline;
    margin-top: 16px;
    margin-bottom: 6px;
}
p {
    font-size: 12pt;
    line-height: 1.5;
    text-align: justify;
    margin-top: 0;
    margin-bottom: 10px;
}
ul, ol {
    font-size: 12pt;
    line-height: 1.5;
    margin-top: 4px;
    margin-bottom: 12px;
    padding-left: 26px;
    text-align: justify;
}
li {
    margin-bottom: 6px;
}
.code-block {
    font-family: 'Courier New', Courier, monospace;
    font-size: 9.5pt;
    line-height: 1.35;
    background: #fdfdfd;
    border: 1px solid #c0c0c0;
    border-left: 4px solid #0d6efd;
    padding: 10px 14px;
    margin: 12px 0 16px 0;
    white-space: pre-wrap;
    word-break: break-word;
    page-break-inside: avoid;
}
.mockup-container {
    border: 1px solid #555;
    border-radius: 6px;
    overflow: hidden;
    margin: 14px 0 6px 0;
    background: #fff;
    page-break-inside: avoid;
    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
}
.mockup-header-browser {
    background: #e9ecef;
    border-bottom: 1px solid #ccc;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: Arial, sans-serif;
    font-size: 9.5pt;
}
.dots {
    display: flex;
    gap: 5px;
}
.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
}
.dot-red { background: #ff5f56; }
.dot-yellow { background: #ffbd2e; }
.dot-green { background: #27c93f; }
.url-bar {
    background: #fff;
    border: 1px solid #ced4da;
    border-radius: 12px;
    padding: 2px 14px;
    flex-grow: 1;
    color: #495057;
    font-size: 9pt;
}
.mockup-header-postman {
    background: #0f172a;
    color: #f8fafc;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: Arial, sans-serif;
    font-size: 9.5pt;
    font-weight: bold;
}
.mockup-header-term {
    background: #1e1e1e;
    color: #cccccc;
    padding: 6px 12px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 9pt;
    border-bottom: 1px solid #333;
}
.mockup-body {
    padding: 12px;
    background: #ffffff;
    font-family: Arial, sans-serif;
}
.terminal-body {
    background: #181818;
    color: #00ff66;
    padding: 12px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 9.5pt;
    line-height: 1.4;
    white-space: pre-wrap;
}
.postman-body {
    background: #1e293b;
    color: #e2e8f0;
    padding: 12px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 9.5pt;
    line-height: 1.35;
    white-space: pre-wrap;
}
.figure-title {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    font-weight: bold;
    text-align: center;
    margin-top: 6px;
    margin-bottom: 4px;
    text-decoration: underline;
}
.figure-desc {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    text-align: justify;
    margin-bottom: 16px;
}
.conclusion-text {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    text-align: justify;
    margin-top: 8px;
    margin-bottom: 12px;
}
.page-break {
    page-break-after: always;
}
"""

def make_browser_mockup(url, content_html):
    return f"""
    <div class="mockup-container">
        <div class="mockup-header-browser">
            <div class="dots">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
            </div>
            <div class="url-bar">{url}</div>
        </div>
        <div class="mockup-body">
            {content_html}
        </div>
    </div>
    """

def make_terminal_mockup(title, content_text):
    return f"""
    <div class="mockup-container">
        <div class="mockup-header-term">⚙ Terminal: {title}</div>
        <div class="terminal-body">{content_text}</div>
    </div>
    """

def make_postman_mockup(method, endpoint, status_code, time_ms, response_json):
    status_color = "#22c55e" if "20" in status_code else ("#ef4444" if "40" in status_code or "50" in status_code else "#3b82f6")
    return f"""
    <div class="mockup-container">
        <div class="mockup-header-postman">
            <div><span style="color:#ff6c37; margin-right:8px;">POSTMAN</span> | <span style="color:#38bdf8;">{method}</span> {endpoint}</div>
            <div>Status: <span style="color:{status_color}; font-weight:bold;">{status_code}</span> | Time: {time_ms}</div>
        </div>
        <div class="postman-body">{response_json}</div>
    </div>
    """

def make_figure(fig_num, title, explanation, mockup_html):
    return f"""
    <div style="page-break-inside: avoid; margin-bottom: 14px;">
        {mockup_html}
        <div class="figure-title">Figure {fig_num} {title}</div>
        <div class="figure-desc">{explanation}</div>
    </div>
    """

def generate_report_html(exp_num, title, aim, tools_list, theory_paragraphs, methodology_paragraphs, procedure_steps, code_snippets, figures, conclusion_paragraphs):
    tools_html = "".join([f"<li>{t}</li>" for t in tools_list])
    theory_html = "".join([f"<p>{p}</p>" for p in theory_paragraphs])
    method_html = "".join([f"<p>{m}</p>" for m in methodology_paragraphs])
    proc_html = "".join([f"<li>{s}</li>" for s in procedure_steps])
    
    codes_html = ""
    for c_title, c_code in code_snippets:
        codes_html += f"<div style='font-family: Times New Roman, serif; font-size:11pt; font-weight:bold; margin-top:8px;'>// File: {c_title}</div><div class='code-block'>{c_code}</div>"
        
    figs_html = "".join([make_figure(f["num"], f["title"], f["desc"], f["mockup"]) for f in figures])
    conc_html = "".join([f"<p class='conclusion-text'>{cp}</p>" for cp in conclusion_paragraphs])
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Experiment {exp_num} - {title}</title>
    <style>
{BASE_CSS}
    </style>
</head>
<body>
    <div class="header-box">
        <div class="header-college">Bharati Vidyapeeth College of Engineering, Navi Mumbai</div>
        <div class="header-dept">Department of Information Technology | Academic Year 2026-2027</div>
        <div class="header-meta">Subject: Web Lab (Course Code: 2345117) | Class: T.E. Information Technology (Sem V)</div>
    </div>

    <h2 class="exp-heading">Experiment No. {exp_num} - {title}</h2>

    <p><u><b>Aim:</b></u> {aim}</p>

    <h3 class="section-heading">Tools Used:</h3>
    <ul>
        {tools_html}
    </ul>

    <h3 class="section-heading">Theory:</h3>
    {theory_html}

    <h3 class="section-heading">Methodology:</h3>
    {method_html}

    <h3 class="section-heading">Procedure:</h3>
    <ol>
        {proc_html}
    </ol>

    <h3 class="section-heading">Code:</h3>
    {codes_html}

    <h3 class="section-heading">Output:</h3>
    {figs_html}

    <h3 class="section-heading">Conclusion:</h3>
    {conc_html}
</body>
</html>"""
    return html
