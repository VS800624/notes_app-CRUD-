import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"

const appStore = configureStore({
  reducer: {
    user: userReducer,
  }
})

export default appStore


// Note this reducer is a big reducer which contain small reducers like userReducer

// this appStore is the combination of this small reducer (userRedu