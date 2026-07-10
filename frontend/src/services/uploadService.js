import api from "./api";

export const uploadDocument = async (
file,
domain,
userUid
) => {
const formData = new FormData();

formData.append(
    "file",
    file
);

formData.append(
    "domain",
    domain
);

formData.append(
    "user_uid",
    userUid
);

const response = await api.post(
    "/upload",
    formData,
    {
        headers: {
            "Content-Type":
                "multipart/form-data"
        }
    }
);

return response.data;
};
