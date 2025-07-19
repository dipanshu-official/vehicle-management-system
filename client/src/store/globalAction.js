import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

// register user
export const registerAsync = createAsyncThunk(
  "global/register",
  async (userData, { rejectWithValue }) => {
    const { username, email, password, role } = userData;

    if (!username || !email || !password) {
      return rejectWithValue({ message: "All fields are required" });
    }

    try {
      const response = await axiosInstance.post("/auth/register", userData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// login user
export const loginAsync = createAsyncThunk(
  "global/login",
  async (userData, { rejectWithValue }) => {
    const { email, password } = userData;

    if (!email || !password) {
      return rejectWithValue({ message: "Email and password are required" });
    }

    try {
      const response = await axiosInstance.post("/auth/login", userData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// get user profile
export const getUserProfileAsync = createAsyncThunk(
  "global/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/profile", {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// Add vehicle
export const addVehicleAsync = createAsyncThunk(
  "global/addVehicle",
  async (vehicleData, { rejectWithValue }) => {
    const { name, capacityKg, tyres } = vehicleData;
    if (!name || !capacityKg || !tyres) {
      return rejectWithValue({ message: "All fields are required" });
    }

    try {
      const response = await axiosInstance.post("/vehicles", vehicleData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// Get available vehicles
export const getAvailableVehiclesAsync = createAsyncThunk(
  "global/getAvailableVehicles",
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/vehicles/available", {
        params: queryParams,
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// Get all vehicles
export const getAllVehicles = createAsyncThunk(
  "global/getAllVehicles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/vehicles", {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// update vehicles
export const updateVehiclesAsync = createAsyncThunk(
  "vehicles/updateVehiclesAsync",
  async ({ id, name, capacityKg, tyres }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/vehicles/${id}`, {
        name,
        capacityKg,
        tyres,
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Server error");
    }
  }
);


// delete vehicles
export const deleteVehiclesAsync = createAsyncThunk(
  "vehicles/deleteVehiclesAsync",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/vehicles/${id}`, {
        headers: getAuthHeader(),
      });
      return id; // returning deleted vehicle
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
