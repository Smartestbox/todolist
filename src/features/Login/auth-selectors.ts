import { RootStateType } from '../../components/App/store'

export const selectIsLoggedIn = (state: RootStateType) => state.auth.isLoggedIn
