#!/usr/bin/env python3
"""CV Parser - Extracts text from PDF and Word CV files."""

import sys
import json
import os

def parse_pdf(filepath: str) -> str:
    try:
        import pdfplumber
        with pdfplumber.open(filepath) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() or ""
        return text
    except ImportError:
        try:
            import PyPDF2
            with open(filepath, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() or ""
            return text
        except ImportError:
            return "ERROR: Install pdfplumber or PyPDF2: pip install pdfplumber"

def parse_docx(filepath: str) -> str:
    try:
        import docx
        doc = docx.Document(filepath)
        return "\n".join([para.text for para in doc.paragraphs])
    except ImportError:
        return "ERROR: Install python-docx: pip install python-docx"

def parse_cv(filepath: str) -> dict:
    ext = os.path.splitext(filepath)[1].lower()

    if ext == ".pdf":
        text = parse_pdf(filepath)
    elif ext in [".docx", ".doc"]:
        text = parse_docx(filepath)
    else:
        return {"error": f"Format non supporté: {ext}"}

    return {
        "filepath": filepath,
        "extension": ext,
        "text": text,
        "char_count": len(text),
        "success": not text.startswith("ERROR")
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 parse_cv.py <path_to_cv.pdf>")
        sys.exit(1)

    result = parse_cv(sys.argv[1])
    print(json.dumps(result, ensure_ascii=False, indent=2))
