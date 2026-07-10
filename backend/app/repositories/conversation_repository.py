from app.database import get_connection


class ConversationRepository:

    def create_conversation(
        self,
        user_uid: str,
        domain: str,
        title: str
    ):

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO conversations
            (
                user_uid,
                domain,
                title
            )
            VALUES
            (
                %s,
                %s,
                %s
            )
            """,
            (
                user_uid,
                domain,
                title
            )
        )

        connection.commit()

        conversation_id = cursor.lastrowid

        cursor.close()
        connection.close()

        return conversation_id


    def get_user_conversations(
        self,
        user_uid: str
    ):

        connection = get_connection()

        cursor = connection.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT *
            FROM conversations
            WHERE user_uid=%s
            ORDER BY updated_at DESC
            """,
            (
                user_uid,
            )
        )

        conversations = cursor.fetchall()

        cursor.close()
        connection.close()

        return conversations


    def get_conversation(
        self,
        conversation_id: int
    ):

        connection = get_connection()

        cursor = connection.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT *
            FROM conversations
            WHERE id=%s
            """,
            (
                conversation_id,
            )
        )

        conversation = cursor.fetchone()

        cursor.close()
        connection.close()

        return conversation


    def conversation_exists(
        self,
        conversation_id: int
    ):

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM conversations
            WHERE id=%s
            """,
            (
                conversation_id,
            )
        )

        exists = cursor.fetchone()[0] > 0

        cursor.close()
        connection.close()

        return exists


    def save_message(
        self,
        conversation_id: int,
        role: str,
        content: str
    ):

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO messages
            (
                conversation_id,
                role,
                content
            )
            VALUES
            (
                %s,
                %s,
                %s
            )
            """,
            (
                conversation_id,
                role,
                content
            )
        )

        connection.commit()

        cursor.close()
        connection.close()


    def get_messages(
        self,
        conversation_id: int
    ):

        connection = get_connection()

        cursor = connection.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT *
            FROM messages
            WHERE conversation_id=%s
            ORDER BY created_at ASC
            """,
            (
                conversation_id,
            )
        )

        messages = cursor.fetchall()

        cursor.close()
        connection.close()

        return messages


    def update_title(
        self,
        conversation_id: int,
        title: str
    ):

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute(
            """
            UPDATE conversations
            SET title=%s
            WHERE id=%s
            """,
            (
                title,
                conversation_id
            )
        )

        connection.commit()

        cursor.close()
        connection.close()


    def update_last_activity(
        self,
        conversation_id: int
    ):

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute(
            """
            UPDATE conversations
            SET updated_at=NOW()
            WHERE id=%s
            """,
            (
                conversation_id,
            )
        )

        connection.commit()

        cursor.close()
        connection.close()


    def delete_conversation(
        self,
        conversation_id: int
    ):

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute(
            """
            DELETE
            FROM conversations
            WHERE id=%s
            """,
            (
                conversation_id,
            )
        )

        connection.commit()

        cursor.close()
        connection.close()