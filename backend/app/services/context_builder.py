def build_context(results):

    context = ""

    for item in results:
        context += item["document"]
        context += "\n\n"

    return context.strip()