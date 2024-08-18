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

    if (response.status === 200) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "steamcupplus_students.xlsx"); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return {
        status: response.status,
        message: "Successfully exported students data",
      };
    }
  } catch (error) {
    throw new Error("Failed to export students data: " + error.message);
  }
};

const exportCompetitionToExcel = async (token, competitionId, fileName) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_API}/file/excel/${competitionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );
    if (response.status === 200) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.xlsx`); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return {
        status: response.status,
        message: "Successfully exported competition data",
      };
    }
  } catch (error) {
    const errorMessage =
      error.response?.status === 500
        ? "Cannot export empty sign-up data"
        : error.message || "An unknown error occurred";

    throw new Error(`Failed to export competition data: ${errorMessage}`);
  }
};

export { getAchievementImage, exportToExcel, exportCompetitionToExcel };
