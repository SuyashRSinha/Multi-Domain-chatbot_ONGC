from pathlib import Path

from app.database import get_connection


class AnalyticsRepository:

    def get_total_conversations(self, email):

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """SELECT COUNT(*) FROM conversations WHERE user_uid = %s""",
            (email,)
        )

        total = cursor.fetchone()[0]

        cursor.close()
        connection.close()

        return total

    def get_total_messages(self, email):

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """SELECT COUNT(*) FROM messages m JOIN conversations c ON m.conversation_id = c.id WHERE c.user_uid = %s""",
            (email,)
        )

        total = cursor.fetchone()[0]

        cursor.close()
        connection.close()

        return total

    def get_total_queries(self, email):

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """SELECT COUNT(*) FROM query_logs WHERE user_email = %s""",
            (email,)
        )

        total = cursor.fetchone()[0]

        cursor.close()
        connection.close()

        return total

    def get_total_documents(self, email):

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """SELECT COUNT(*) FROM uploaded_documents WHERE user_email = %s""",
            (email,)
        )

        total = cursor.fetchone()[0]

        cursor.close()
        connection.close()

        return total
    
    def get_domain_usage(self, email):

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """SELECT
            domain,
            COUNT(*) count
        FROM uploaded_documents
        WHERE user_email=%s
        GROUP BY domain
        ORDER BY count DESC""",
            (email,)
        )

        data = cursor.fetchall()

        cursor.close()
        connection.close()

        return data
    

        
    
    
       