def build_source(results):

    source = []

    for result in results:

        filename = result["metadata"]["source"]

        if filename not in source:
            source.append(filename)

    return source
