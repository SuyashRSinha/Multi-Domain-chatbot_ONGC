import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
const API = `${API_BASE}/analytics`;

export async function getAnalyticsDashboard(
    email
) {

    const response = await axios.get(
        `${API}/dashboard?email=${email}`
    );

    return response.data;
}

export async function getDomainUsage(
    email
) {

    const response = await axios.get(
        `${API}/domain-usage?email=${email}`
    );

    return response.data;
}