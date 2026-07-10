from langchain.text_splitter import RecursiveCharacterTextSplitter


def create_chunks(text: str):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    chunks = splitter.split_text(text)

    return chunks