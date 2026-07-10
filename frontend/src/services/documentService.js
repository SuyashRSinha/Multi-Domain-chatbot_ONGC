import api from "./api";

export const getDocuments = async () => {
    const response = await api.get("/documents");
    return response.data;
};

export const deleteDocument = async (domain, filename) => {
    const response = await api.delete("/documents", {
        params: {
            domain,
            filename,
        },
    });

    return response.data;
}