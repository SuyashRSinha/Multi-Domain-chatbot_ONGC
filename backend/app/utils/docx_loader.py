from docx import Document


def load_docx(docx_path: str) -> str:
    """
    Reads a DOCX file and returns its text.
    """

    document = Document(docx_path)

    text = ""

    for paragraph in document.paragraphs:
        text += paragraph.text + "\n"

    return text