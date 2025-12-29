from fastapi import FastAPI, UploadFile, File
from extractor import extract_zip_files
from model import calculate_similarity
from utils import format_response

app = FastAPI()

@app.post("/check")
async def check_plagiarism(file: UploadFile = File(...)):
    if file.content_type not in ["application/zip", "application/x-zip-compressed"]:
        return {"error": "Upload a .zip file only"}

    # Extract ZIP contents
    extracted_files = await extract_zip_files(file)

    if not extracted_files:
        return {"error": "No valid code files found"}

    # Calculate similarity
    score, comparisons = calculate_similarity(extracted_files)

    return format_response(score, comparisons)
