from pathlib import Path

from app.database import get_connection


class AdminRepository:

    def __init__(self):

        self.upload_root = (
            Path(__file__).resolve().parents[2] / "uploads"
        )

    def get_total_conversations(self):

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT COUNT(*)
            FROM conversations
        """)

        total = cursor.fetchone()[0]

        cursor.close()
        connection.close()

        return total

    def get_total_messages(self):

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT COUNT(*)
            FROM messages
        """)

        total = cursor.fetchone()[0]

        cursor.close()
        connection.close()

        return total

    def get_recent_conversations(self):

        connection = get_connection()

        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                title,
                created_at
            FROM conversations
            ORDER BY created_at DESC
            LIMIT 10
        """)

        rows = cursor.fetchall()

        cursor.close()
        connection.close()

        return rows

    def get_total_documents(self):

        total = 0

        if not self.upload_root.exists():
            return 0

        for domain in self.upload_root.iterdir():

            if domain.is_dir():

                total += len([
                    file
                    for file in domain.iterdir()
                    if file.is_file()
                ])

        return total

    def get_documents_per_domain(self):

        stats = []

        if not self.upload_root.exists():
            return stats

        for domain in self.upload_root.iterdir():

            if domain.is_dir():

                count = len([
                    file
                    for file in domain.iterdir()
                    if file.is_file()
                ])

                stats.append({

                    "domain": domain.name,

                    "count": count

                })

        return stats