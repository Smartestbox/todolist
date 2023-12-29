import { authAPI, LoginDataType } from './../api/authApi'
import { AnyAction, createSlice, isAnyOf } from '@reduxjs/toolkit'
import { clearTasksAndTodolists } from 'common/actions/commonActions'
import { createAppAsyncThunk } from 'common/utils'
import { RESULT_CODE } from 'common/enums'
import { appActions } from 'app/model/appSlice'

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>('auth/initializeApp', async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    const res = await authAPI.me()

    dispatch(appActions.setAppIsInitialized({ isInitialized: true }))

    if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
        return { isLoggedIn: true }
    } else {
        return rejectWithValue(res.data)
    }
})

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, { loginData: LoginDataType }>(
    'auth/login',
    async (arg, thunkAPI) => {
        const { rejectWithValue } = thunkAPI
        const res = await authAPI.login(arg.loginData)

        if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
            return { isLoggedIn: true }
        } else {
            return rejectWithValue(res.data)
        }
    },
)

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>('auth/logout', async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    const res = await authAPI.logout()

    if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
        dispatch(clearTasksAndTodolists())
        return { isLoggedIn: false }
    } else {
        return rejectWithValue(res.data)
    }
})

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            isAnyOf(authThunks.login.fulfilled, authThunks.logout.fulfilled, authThunks.initializeApp.fulfilled),
            (state, action: AnyAction) => {
                state.isLoggedIn = action.payload.isLoggedIn
            },
        )
    },
})

export const authReducer = slice.reducer
export const authThunks = { login, initializeApp, logout }
export type AuthInitialState = ReturnType<typeof slice.getInitialState>
