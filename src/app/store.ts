import { configureStore } from '@reduxjs/toolkit'
import { appReducer } from 'app/model/appSlice'
import { todolistsReducer } from 'features/TodolistsList/model/todolists/todolistsSlice'
import { tasksReducer } from 'features/TodolistsList/model/tasks/tasksSlice'
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

// @ts-ignore
window.store = store
