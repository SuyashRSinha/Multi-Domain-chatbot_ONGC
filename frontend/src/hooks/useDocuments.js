import { useEffect, useState } from "react";

import {
    getDocuments
} from "../services/documentService";

export function useDocuments() {

    const [documents, setDocuments] = useState([]);

    const loadDocuments = async () => {

        try {

            const data = await getDocuments();

            setDocuments(data);

        }

        catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {

        loadDocuments();

    }, []);

    return {

        documents,

        loadDocuments

    };

}