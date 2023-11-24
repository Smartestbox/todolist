import {AnyAction, applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {TodolistsActionTypes, todolistsReducer} from "../../features/TodolistsList/todolists-reducer";
import {TasksActionTypes, tasksReducer} from "../../features/TodolistsList/tasks-reducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {useDispatch} from "react-redux";
import {AppActionsType, appReducer} from "./app-reducer";

const rootReducer = combineReducers({
    app: appReducer,
    todolists: todolistsReducer,
    tasks: tasksReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

export type RootStateType = ReturnType<typeof rootReducer>

export type AppDispatchType = ThunkDispatch<RootStateType, unknown, AnyAction>
export const useAppDispatch = useDispatch<AppDispatchType>

export type AllActionTypes = TasksActionTypes | TodolistsActionTypes | AppActionsType

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootStateType, unknown, AllActionTypes>

// @ts-ignore
window.store = store