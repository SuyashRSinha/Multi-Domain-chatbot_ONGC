import json
from pathlib import Path
from datetime import datetime


class SummaryCacheService:

    def __init__(self):

        self.base_path = Path("summary_cache")

    def _get_file_path(
        self,
        domain: str,
        source_file: str
    ):

        domain_folder = self.base_path / domain

        domain_folder.mkdir(
            parents=True,
            exist_ok=True
        )

        filename = Path(source_file).stem + ".json"

        return domain_folder / filename

    def save_summary(
        self,
        domain: str,
        source_file: str,
        summary: str
    ):

        file_path = self._get_file_path(
            domain,
            source_file
        )

        data = {
            "document": source_file,
            "summary": summary,
            "generated_at": datetime.now().isoformat()
        }

        with open(
            file_path,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                data,
                file,
                indent=4,
                ensure_ascii=False
            )

    def load_summary(
        self,
        domain: str,
        source_file: str
    ):

        file_path = self._get_file_path(
            domain,
            source_file
        )

        if not file_path.exists():
            return None

        with open(
            file_path,
            "r",
            encoding="utf-8"
        ) as file:

            return json.load(file)

    def summary_exists(
        self,
        domain: str,
        source_file: str
    ):

        return self._get_file_path(
            domain,
            source_file
        ).exists()

    def delete_summary(
        self,
        domain: str,
        source_file: str
    ):

        file_path = self._get_file_path(
            domain,
            source_file
        )

        if file_path.exists():
            file_path.unlink()