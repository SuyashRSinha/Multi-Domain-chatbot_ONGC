def format_history(messages):

    if not messages:
        return ""

    history = "Conversation History:\n\n"

    for message in messages:

        role = message["role"].capitalize()

        history += f"{role}: {message['content']}\n\n"

    return history.strip()