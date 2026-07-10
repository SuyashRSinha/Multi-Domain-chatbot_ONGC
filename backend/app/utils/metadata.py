import os


def build_metadata(domain, file_path):

    return {

        "domain": domain,

        "source": os.path.basename(file_path),

        "path": file_path,

        "filename": os.path.splitext(
            os.path.basename(file_path)
        )[0]
    }