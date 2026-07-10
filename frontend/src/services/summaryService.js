import api from "./api";

export const getSummaryStatus = async (domain, filename) => {
  const response = await api.get("/summary/status", {
    params: {
      domain,
      filename,
    },
  });

  return response.data;
};

export const downloadSummary = async (domain, filename) => {
  const response = await api.get("/summary/download", {
    params: {
      domain,
      filename,
    },
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(
    new Blob([response.data])
  );

  const link = document.createElement("a");

  link.href = url;

  link.download = filename.replace(
    ".pdf",
    "_summary.pdf"
  );

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};