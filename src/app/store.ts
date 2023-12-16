import { AnyAction } from 'redux'
import { todolistsReducer } from '../features/TodolistsList/todolists-reducer'
import { tasksReducer } from '../features/TodolistsList/tasks-reducer'
import { ThunkAction } from 'redux-thunk'
import { authReducer } from '../features/Login/auth-reducer'
import { configureStore } from '@reduxjs/toolkit'
import { appReducer } from './app-reducer'

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
