import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  authToken: string | null
  address: string | null
  walletType: string | null
  dialectJwt: string | null
}

const initialState: AuthState = {
  authToken: null,
  address: null,
  walletType: null,
  dialectJwt: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthDetails: (
      state,
      action: PayloadAction<{ authToken: string; address: string; walletType: string }>,
    ) => {
      state.authToken = action.payload.authToken
      state.address = action.payload.address
      state.walletType = action.payload.walletType
    },
    clearAuthDetails: (state) => {
      state.authToken = null
      state.address = null
      state.walletType = null
    },
    setDialectJwt: (state, action: PayloadAction<string>) => {
      state.dialectJwt = action.payload
    },
    clearDialectJwt: (state) => {
      state.dialectJwt = null
    },
  },
})

export const { setAuthDetails, clearAuthDetails, setDialectJwt, clearDialectJwt } =
  authSlice.actions
export default authSlice.reducer
