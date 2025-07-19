import { createSlice } from "@reduxjs/toolkit";
import {
  addVehicleAsync,
  deleteVehiclesAsync,
  getAllVehicles,
  getUserProfileAsync,
  registerAsync,
  updateVehiclesAsync,
} from "./globalAction";

const initialState = {
  allvehicles: [],
  vehicles: [],
  userProfile: [],
  loading: false,
  error: null,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    showLoader: (state) => {
      state.loading = true;
    },
    hideLoader: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserProfileAsync.fulfilled, (state, action) => {
      state.userProfile = action.payload.data;
    });
    builder.addCase(getAllVehicles.fulfilled, (state, action) => {
      state.allvehicles = action.payload.data;
    });
    builder.addCase(addVehicleAsync.fulfilled, (state, action) => {
      state.allvehicles.push(action.payload.data); // ✅ Add newly created vehicle
    });
    builder.addCase(deleteVehiclesAsync.fulfilled, (state, action) => {
      state.allvehicles = state.allvehicles.filter(
        (v) => v._id !== action.payload
      );
    });

    builder.addCase(updateVehiclesAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = "Vehicle updated successfully";
      const updated = action.payload;

      // Update the specific vehicle in the state
      const index = state.allvehicles.findIndex((v) => v._id === updated._id);
      if (index !== -1) {
        state.allvehicles[index] = updated;
      }
    });
  },
});

export const { clearError, showLoader, hideLoader } = globalSlice.actions;
export default globalSlice.reducer;
