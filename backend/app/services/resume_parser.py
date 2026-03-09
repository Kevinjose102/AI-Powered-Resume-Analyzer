import pdfplumber
import tempfile
import os


def extract_text_from_pdf(file):
    """Extract text from an uploaded PDF file."""

    text = ""

    # Save uploaded file to a temp file first (fixes Windows SpooledTemporaryFile issues)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(file.file.read())
        tmp_path = tmp.name

    try:
        with pdfplumber.open(tmp_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    finally:
        os.unlink(tmp_path)  # clean up temp file

    return text.strip()