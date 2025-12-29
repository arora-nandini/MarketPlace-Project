import zipfile
import tempfile
import os

async def extract_zip_files(uploaded_file):
    # Create a temporary directory
    temp_dir = tempfile.mkdtemp()
    zip_path = os.path.join(temp_dir, "upload.zip")

    # Save the uploaded file to disk
    with open(zip_path, "wb") as f:
        f.write(await uploaded_file.read())

    extracted = {}

    # Extract all contents of the zip
    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(temp_dir)

    # Walk through extracted files
    for root, _, files in os.walk(temp_dir):
        for filename in files:
            # skip the uploaded zip itself
            if filename == "upload.zip":
                continue
            path = os.path.join(root, filename)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                    # Use relative path to avoid collisions
                    rel_path = os.path.relpath(path, temp_dir)
                    extracted[rel_path] = content
            except Exception as e:
                print(f"Failed to read {path}: {e}")

    return extracted
