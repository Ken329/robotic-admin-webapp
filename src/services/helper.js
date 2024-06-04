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

export { getAchievementImage };
