import axios from "axios";

const getAchievementImage = async (url, token) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });
    return response?.data;
  } catch (error) {
    throw new Error(
      "Get achievement image failed: " + error.response?.data?.message
    );
  }
};

const exportToExcel = async (token) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_API}/file/excel`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "steamcupplus_students.xlsx"); // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    throw new Error(error);
  }
};

export { getAchievementImage, exportToExcel };
