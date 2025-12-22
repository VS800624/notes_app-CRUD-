const { createSlice } = require("@reduxjs/toolkit");


const userSlice = createSlice({
  name: user,
  initialState: {
    isAuthenticated: false,
    user: null,
    token: null,
  },
  reducers: {
    loginSuccess: (state,action) => {
       state.isAuthenticated = true,
       state.user = action.payload.user
       state.token = action.payload.token
    },
    logout: (state, action) => {
      state.isAuthenticated = false,
      state.user = null,
      state.token = null
    }
  }
})

export const {loginSuccess, logout} = userSlice.actions
// here we are taking out these actions individually, and exporting it.
export default userSlice.reducer

// so userSlice is kind of like a big object which have actions and reducers so we are doing export default  userSlice.reducer , we are giving the reducer 
// A reducer is the combination of many small reducers cartSlice.reducer is the combination of above reducers i.e. addUser and removeUser (that is why it is written as reducers )