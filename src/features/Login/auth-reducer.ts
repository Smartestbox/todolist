import { AppThunk } from '../../components/App/store'
import { authAPI, RESULT_CODE } from '../../api/todolist-api'
import { handleServerNetworkError } from '../../utils/handleServerNetworkError'
import { LoginDataType } from './Login'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { appActions } from '../../components/App/app-reducer'
import { clearTasksAndTodolists } from '../../common/actions/common-actions'
import { handleServerAppError } from '../../utils/handleServerAppError'

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        },
    },
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export type AuthInitialState = ReturnType<typeof slice.getInitialState>

// Thunks
export const meTC = (): AppThunk => async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
            dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
            dispatch(appActions.setAppStatus({ status: 'completed' }))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        handleServerNetworkError(dispatch, e as { message: string })
    } finally {
        dispatch(appActions.setAppIsInitialized({ isInitialized: true }))
    }
}
export const loginTC =
    (loginData: LoginDataType): AppThunk =>
    async (dispatch) => {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        try {
            const res = await authAPI.login(loginData)
            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
                dispatch(appActions.setAppStatus({ status: 'completed' }))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        } catch (e) {
            handleServerNetworkError(dispatch, e as { message: string })
        }
    }

export const logoutTC = (): AppThunk => async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
            dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }))
            dispatch(appActions.setAppStatus({ status: 'completed' }))
            dispatch(clearTasksAndTodolists())
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        handleServerNetworkError(dispatch, e as { message: string })
    }
}
