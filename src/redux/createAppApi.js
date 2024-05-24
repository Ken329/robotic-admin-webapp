import axios from "axios";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { resetApp } from "./slices/app";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_BASE_API,
  prepareHeaders: (headers) => {
    const accessToken = JSON.parse(localStorage.getItem("token")).accessToken;
    headers.set("Authorization", `Bearer ${accessToken}`);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = JSON.parse(localStorage.getItem("token")).refreshToken;

    try {
      const refreshResult = await axios.post(
        `${process.env.REACT_APP_BASE_API}/auth/refresh-token`,
        { refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (refreshResult.status === 200) {
        localStorage.setItem(
          "token",
          JSON.stringify(refreshResult?.data?.data)
        );
        result = await baseQuery(args, api, extraOptions);
      } else {
        await api.dispatch(resetApp());
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      await api.dispatch(resetApp());
    }
  }

  return result;
};

export const baseApiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => {
    return {};
  },
});
