import {AppThunk} from "../../components/App/store";
import {setAppIsInitializedAC, setAppStatusAC} from "../../components/App/app-reducer";
import {authAPI, RESULT_CODE} from "../../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {LoginDataType} from "./Login";


const initialState = {
    isLoggedIn: false
}

export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType) => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {
                ...state,
                isLoggedIn: action.isLoggedIn
            }
        default:
            return state
    }
}

// Actions
export const setIsLoggedInAC = (isLoggedIn: boolean) => ({
    type: 'login/SET-IS-LOGGED-IN' as const,
    isLoggedIn
})

// Thunks
export const meTC = (): AppThunk =>
    async (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        try {
            const res = await authAPI.me()
            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('completed'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        } catch (e) {
            handleServerNetworkError(dispatch, (e as { message: string }))
        } finally {
            dispatch(setAppIsInitializedAC(true))
        }
    }
export const loginTC = (loginData: LoginDataType): AppThunk =>
    async (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        try {
            const res = await authAPI.login(loginData)
            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('completed'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        } catch (e) {
            handleServerNetworkError(dispatch, (e as { message: string }))
        }
    }

export const logoutTC = (): AppThunk =>
    async (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        try {
            const res = await authAPI.logout()
            if(res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('completed'))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        } catch (e) {
            handleServerNetworkError(dispatch, (e as {message: string}))
        }
    }


// Types
export type AuthActionsType = ReturnType<typeof setIsLoggedInAC>
export type InitialStateType = typeof initialState
