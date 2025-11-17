import { createSlice } from "@reduxjs/toolkit";

const rtmSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [],
  },
  reducers: {
    setLikeNotification: (state, action) => {
      const data = action.payload;

      if (data.type === "like") {
        state.likeNotification.push(data);
      } else if (data.type === "dislike") {
        state.likeNotification = state.likeNotification.filter(
          (item) => item.userId !== data.userId
        );
      }
    },

    clearNotifications: (state) => {
      state.likeNotification = [];
    }
  },
});

export const { setLikeNotification, clearNotifications } = rtmSlice.actions;
export default rtmSlice.reducer;
