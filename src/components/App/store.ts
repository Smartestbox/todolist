import {AnyAction, applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {TodolistsActionTypes, todolistsReducer} from "../../features/TodolistsList/todolists-reducer";
import {TasksActionTypes, tasksReducer} from "../../features/TodolistsList/tasks-reducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppActionsType, appReducer} from "./app-reducer";
import {AuthActionsType, authReducer} from "../../features/Login/auth-reducer";

const rootReducer = combineReducers({
    app: appReducer,
    todolists: todolistsReducer,
    tasks: tasksReducer,
    auth: authReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

export type RootStateType = ReturnType<typeof rootReducer>

export type AppDispatchType = ThunkDispatch<RootStateType, unknown, AnyAction>
export const useAppDispatch = useDispatch<AppDispatchType>
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector

export type AllActionTypes = TasksActionTypes | TodolistsActionTypes | AppActionsType | AuthActionsType

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootStateType, unknown, AllActionTypes>

// @ts-ignore
window.store = store