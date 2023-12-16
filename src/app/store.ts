import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
import { appReducer } from 'app/appSlice'
import { todolistsReducer } from 'features/TodolistsList/todolistsSlice'
import { tasksReducer } from 'features/TodolistsList/tasksSlice'
import { authReducer } from 'features/auth/model/authSlice'

export const store = configureStore({
    reducer: {
        app: appReducer,
        todolists: todolistsReducer,
        tasks: tasksReducer,
        auth: authReducer,
    },
})
export type RootStateType = ReturnType<typeof store.getState>

// export type AppDispatchType = ThunkDispatch<RootStateType, unknown, AnyAction>
export type AppDispatchType = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootStateType, unknown, AnyAction>

// @ts-ignore
window.store = store
