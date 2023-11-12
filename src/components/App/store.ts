import {AnyAction, applyMiddleware, combineReducers, Dispatch, legacy_createStore} from "redux";
import {todolistsReducer} from "../../features/TodolistsList/todolists-reducer";
import {tasksReducer} from "../../features/TodolistsList/tasks-reducer";
import thunk, {ThunkDispatch} from "redux-thunk";
import {useDispatch} from "react-redux";

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppDispatch = Dispatch<AnyAction> & ThunkDispatch<AppRootStateType, null, AnyAction>
export const useAppDispatch : () => AppDispatch = useDispatch


// @ts-ignore
window.store = store