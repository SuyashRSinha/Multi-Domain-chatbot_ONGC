from app.database import get_connection


class DocumentRepository:

    def save_document(
        self,
        filename,
        domain,
        user_email
    ):

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO uploaded_documents
            (
                filename,
                domain,
                user_email
            )
            VALUES
            (%s,%s,%s)
            """,
            (
                filename,
                domain,
                user_email
            )
        )

        connection.commit()

        cursor.close()
        connection.close()