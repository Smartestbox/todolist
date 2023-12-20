import { RootStateType } from 'app/store'

export const selectAppStatus = (state: RootStateType) => state.app.status
export const selectAppIsInitialized = (state: RootStateType) => state.app.isInitialized
export const selectAppError = (state: RootStateType) => state.app.error
