import { authAPI, LoginDataType } from './../api/authApi'
import { createSlice } from '@reduxjs/toolkit'
import { appActions } from 'app/model/appSlice'
import { clearTasksAndTodolists } from 'common/actions/commonActions'
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from 'common/utils'
import { RESULT_CODE } from 'common/enums'
import { thunkTryCatch } from 'common/utils/thunkTryCatch'

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>('auth/me', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        const res = await authAPI.me()

        if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
            dispatch(appActions.setAppStatus({ status: 'completed' }))
            return { isLoggedIn: true }
        } else {
            dispatch(appActions.setAppStatus({ status: 'failed' }))
            return rejectWithValue(null)
        }
    }).finally(() => {
        dispatch(appActions.setAppIsInitialized({ isInitialized: true }))
    })
})

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, { loginData: LoginDataType }>(
    'auth/login',
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        try {
            const res = await authAPI.login(arg.loginData)

            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(appActions.setAppStatus({ status: 'completed' }))
                return { isLoggedIn: true }
            } else {
                const isShowAppError = !res.data.fieldsErrors.length
                handleServerAppError(dispatch, res.data, isShowAppError)
                return rejectWithValue(res.data)
            }
        } catch (e) {
            handleServerNetworkError(dispatch, e)
            return rejectWithValue(null)
        }
    },
)

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>('auth/logout', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
        dispatch(appActions.setAppStatus({ status: 'loading' }))

        const res = await authAPI.logout()

        if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
            dispatch(appActions.setAppStatus({ status: 'completed' }))
            dispatch(clearTasksAndTodolists())
            return { isLoggedIn: false }
        } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(dispatch, e as { message: string })
        return rejectWithValue(null)
    }
})

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
    },
})

export const authReducer = slice.reducer
export const authThunks = { login, initializeApp, logout }
export type AuthInitialState = ReturnType<typeof slice.getInitialState>
