import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  id: null,
  fullName: null,
  email: null,
  isLoading: false,
  subscriptionId: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    changeId: (state, action) => {
      state.id = action.payload
    },
    changeFullName: (state, action) => {
      state.fullName = action.payload
    },
    changeEmail: (state, action) => {
      state.email = action.payload
    },
    changeIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    changeSubscriptionId: (state, action) => {
      state.subscriptionId = action.payload
    }
  }
})

export default userSlice.reducer

export const {changeId, changeFullName, changeEmail, changeIsLoading, changeSubscriptionId} = userSlice.actions

export const selectId = (state) => state.user.id
export const selectFullName = (state) => state.user.fullName
export const selectEmail = (state) => state.user.email
export const selectIsLoading = (state) => state.user.isLoading
export const selectSubscriptinId = (state) => state.user.subscriptionId