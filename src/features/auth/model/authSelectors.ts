import { RootStateType } from 'app/store'

export const selectIsLoggedIn = (state: RootStateType) => state.auth.isLoggedIn
