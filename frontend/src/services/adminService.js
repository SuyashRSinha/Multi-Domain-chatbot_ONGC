import api from "./api";

export const getDashboard =
async (email) => {

    const response =
        await api.get(
            `/admin/dashboard?email=${email}`
        );

    return response.data;
};