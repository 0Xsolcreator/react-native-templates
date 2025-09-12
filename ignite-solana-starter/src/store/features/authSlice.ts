import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  authToken: string | null
  address: string | null
  walletType: string | null
}

const initialState: AuthState = {
  authToken: null,
  address: null,
  walletType: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthDetails: (
      state,
      action: PayloadAction<{ authToken?: string; address?: string; walletType?: string }>,
    ) => {
      if(action.payload.authToken) {
        state.authToken = action.payload.authToken
      }
      if(action.payload.address) {
        state.address = action.payload.address
      }
      if(action.payload.walletType) {
        state.walletType = action.payload.walletType
      }
    },
    clearAuthDetails: (state) => {
      state.authToken = null
      state.address = null
      state.walletType = null
    },
  },
})

export const { setAuthDetails, clearAuthDetails } = authSlice.actions
export default authSlice.reducer
