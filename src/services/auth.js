import axios from "axios";

const generatePublicKey = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_API}/auth/generate-public-key`
    );
    return response?.data?.data?.publicKey;
  } catch (error) {
    throw new Error(
      "Generate public key failed: " + error.response.data.message
    );
  }
};

const generateAccessToken = async (cognitoToken) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_API}/auth/generate-token`,
      {
        accessToken: cognitoToken,
      },
      null
    );
    return response?.data?.data;
  } catch (error) {
    throw new Error("Authentication Failed: " + error.response.data.message);
  }
};

const createCentreAccount = async (payload, token) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_API}/user/center`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error("Sign-up failed: " + error.response.data.message);
  }
};

const verifyOtp = async (payload) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_API}/auth/verify-otp`,
      payload
    );
    return response?.data;
  } catch (error) {
    throw new Error("OTP verification failed: " + error.response.data.message);
  }
};

const logout = async (token) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_API}/auth/logout`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

const getUserById = async (id, token) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_API}/user/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data?.data;
  } catch (error) {
    throw new Error("Get User by ID failed: " + error.response?.data?.message);
  }
};

const createNewLevel = async (payload, token) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_API}/level`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error("Create level failed: " + error.response.data.message);
  }
};

const getLevel = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_API}/level`,
      null
    );
    return response?.data?.data;
  } catch (error) {
    throw new Error("Failed to get levels: " + error.response.data.message);
  }
};

const deleteLevel = async (id, token) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_BASE_API}/level/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw new Error("Delete level failed: " + error.response?.data?.message);
  }
};

export {
  generatePublicKey,
  generateAccessToken,
  createCentreAccount,
  verifyOtp,
  logout,
  getUserById,
  createNewLevel,
  getLevel,
  deleteLevel
};
