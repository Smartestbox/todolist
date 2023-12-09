import { AnyAction, combineReducers } from "redux"
import { todolistsReducer } from "../../features/TodolistsList/todolists-reducer"
import { tasksReducer } from "../../features/TodolistsList/tasks-reducer"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { appReducer } from "./app-reducer"
import { authReducer } from "../../features/Login/auth-reducer"
import { configureStore } from "@reduxjs/toolkit"

const rootReducer = combineReducers({
    app: appReducer,
    todolists: todolistsReducer,
    tasks: tasksReducer,
    auth: authReducer,
})

export const store = configureStore({
    reducer: rootReducer,
})
export type RootStateType = ReturnType<typeof store.getState>

export type AppDispatchType = ThunkDispatch<RootStateType, unknown, AnyAction>
export const useAppDispatch = useDispatch<AppDispatchType>
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootStateType, unknown, AnyAction>

// @ts-ignore
window.store = store
