from pypdf import PdfReader
import docx
import io
import docx

def extract_text(file_bytes, filename):

    if filename.endswith(".pdf"):
        reader = PdfReader(io.BytesIO(file_bytes))
        return "\n".join([page.extract_text() for page in reader.pages])

    elif filename.endswith(".docx"):
        doc = docx.Document(io.BytesIO(file_bytes))
        return "\n".join([para.text for para in doc.paragraphs])

    elif filename.endswith(".txt"):
        return file_bytes.decode("utf-8")

    else:
        raise Exception("Unsupported file type")