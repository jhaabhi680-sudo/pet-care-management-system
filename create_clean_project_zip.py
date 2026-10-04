import os
import zipfile

src_dir = r"C:\Users\tanuj\.gemini\antigravity\scratch\pet-care-management-system"
dest_zip = r"C:\Users\tanuj\.gemini\antigravity\scratch\pet-care-management-system\Pet_Care_Management_System.zip"

print(f"Packaging clean project from: {src_dir}")
print(f"Target ZIP: {dest_zip}")

# Directories to exclude
exclude_dirs = {
    "software 1-10",
    "WT_Practical_Reports",
    "__pycache__",
    ".git",
    "node_modules"
}

# Files to exclude (experiment generation scripts, previous zip files, pdfs, etc.)
exclude_files = {
    "Pet_Care_Management_System_Complete.zip",
    "Pet_Care_Management_System.zip",
    "netlify_deploy.zip",
    "convert_to_pdf.py",
    "build_clean_software_1_to_10.py",
    "generate_exp1_to_4.py",
    "generate_part1.py",
    "generate_part2.py",
    "generate_part3.py",
    "generate_reports.py",
    "generate_software_3_to_10.py",
    "generate_software_all.py",
    "generator_core.py",
    "merge_manual.py",
    "merge_software_1_to_10.py",
    "create_zip.py",
    "create_clean_project_zip.py"
}

file_count = 0
total_size = 0

with zipfile.ZipFile(dest_zip, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(src_dir):
        # Exclude directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith("WT_")]
        
        for file in files:
            # Exclude PDF files, temp files, and generation scripts
            if file.endswith(".pdf") or file.endswith(".pyc") or file.startswith("~$"):
                continue
            if file in exclude_files:
                continue
                
            abs_path = os.path.join(root, file)
            rel_path = os.path.relpath(abs_path, src_dir)
            
            # Double check no experiment files leak in
            if "software 1-10" in rel_path or "WT_Practical" in rel_path:
                continue
                
            zipf.write(abs_path, rel_path)
            file_count += 1
            total_size += os.path.getsize(abs_path)

print(f"[OK] Added {file_count} clean source code & database files.")
print(f"[OK] Uncompressed: {total_size / 1024:.1f} KB")
print(f"[OK] Compressed ZIP: {os.path.getsize(dest_zip) / 1024:.1f} KB")
