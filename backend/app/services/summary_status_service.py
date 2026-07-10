import json
import os
from datetime import datetime


class SummaryStatusService:

    def __init__(self):

        self.base_path = "summary_status"

        os.makedirs(
            self.base_path,
            exist_ok=True
        )

    def _domain_folder(
        self,
        domain: str
    ):

        folder = os.path.join(
            self.base_path,
            domain
        )

        os.makedirs(
            folder,
            exist_ok=True
        )

        return folder

    def _status_path(
        self,
        domain: str,
        source_file: str
    ):

        filename = source_file.replace(".pdf", ".json")

        return os.path.join(
            self._domain_folder(domain),
            filename
        )

    def set_processing(
        self,
        domain: str,
        source_file: str
    ):

        data = {
            "status": "processing",
            "updated_at": datetime.now().isoformat()
        }

        with open(
            self._status_path(domain, source_file),
            "w",
            encoding="utf-8"
        ) as file:
            json.dump(
                data,
                file,
                indent=4
            )

    def set_ready(
        self,
        domain: str,
        source_file: str
    ):

        data = {
            "status": "ready",
            "updated_at": datetime.now().isoformat()
        }

        with open(
            self._status_path(domain, source_file),
            "w",
            encoding="utf-8"
        ) as file:
            json.dump(
                data,
                file,
                indent=4
            )

    def set_failed(
        self,
        domain: str,
        source_file: str
    ):

        data = {
            "status": "failed",
            "updated_at": datetime.now().isoformat()
        }

        with open(
            self._status_path(domain, source_file),
            "w",
            encoding="utf-8"
        ) as file:
            json.dump(
                data,
                file,
                indent=4
            )

    def get_status(
        self,
        domain: str,
        source_file: str
    ):

        path = self._status_path(
            domain,
            source_file
        )

        if not os.path.exists(path):
            return None

        with open(
            path,
            "r",
            encoding="utf-8"
        ) as file:
            return json.load(file)