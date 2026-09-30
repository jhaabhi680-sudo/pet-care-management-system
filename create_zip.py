# create_zip.py - Creates a clean, complete zip archive of the Pet Care Management System
import os
import zipfile

src_dir = r"C:\Users\tanuj\.gemini\antigravity\scratch\pet-care-management-system"
dest_zip = r"C:\Users\tanuj\.gemini\antigravity\scratch\Pet_Care_Management_System_Complete.zip"

print(f"Creating ZIP archive from: {src_dir}")
print(f"Destination: {dest_zip}")

# Files or folders to exclude from zip (temporary bytecode, etc.)
exclude_dirs = {"__pycache__", ".git"}
exclude_extensions = {".pyc"}

file_count = 0
total_size = 0

with zipfile.ZipFile(dest_zip, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(src_dir):
        # Filter out excluded directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            ext = os.path.splitext(file)[1]
            if ext in exclude_extensions or file.endswith(".zip"):
                continue
                
            abs_path = os.path.join(root, file)
            rel_path = os.path.relpath(abs_path, src_dir)
            
            try:
                zipf.write(abs_path, rel_path)
                file_count += 1
                total_size += os.path.getsize(abs_path)
            except Exception as e:
                print(f"Warning skipping {rel_path}: {e}")

print("==================================================")
print(f"✓ ZIP ARCHIVE CREATED SUCCESSFULLY!")
print(f"  Total Files Archived: {file_count}")
print(f"  Uncompressed Size:    {total_size / (1024*1024):.2f} MB")
print(f"  Compressed ZIP Size:   {os.path.getsize(dest_zip) / (1024*1024):.2f} MB")
print(f"  ZIP File Location:     {dest_zip}")
print("==================================================")
