import {TasksFiltersType} from "../../components/App/App";
import {RESULT_CODE, todolistAPI, TodolistDomainType} from "../../api/todolist-api";
import {AppThunk} from "../../components/App/store";
import {AppStatusesType, setAppErrorAC, setAppStatusAC} from "../../components/App/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {Dispatch} from "redux";

const initialState: TodolistType[] = []

export const todolistsReducer = (state: TodolistType[] = initialState, action: TodolistsActionTypes): TodolistType[] => {
    switch (action.type) {
        case 'TODOLIST/DELETE-TODOLIST':
            return state.filter(tl => tl.id !== action.todolistId)
        case 'TODOLIST/CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.todolistId
                ? {...tl, filter: action.filter}
                : tl)
        case 'TODOLIST/CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.todolistId
                ? {...tl, title: action.title}
                : tl)
        case 'TODOLIST/ADD-TODOLIST':
            return [{...action.todolist, filter: 'All', entityStatus: 'idle'}, ...state]
        case 'TODOLIST/SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'All', entityStatus: 'idle'}))
        case 'TODOLIST/SET-ENTITY-STATUS':
            return state.map(tl => tl.id === action.todolistId
                ? {...tl, entityStatus: action.entityStatus}
                : tl)
        default:
            return state
    }
}

// actions
export const deleteTodolistAC = (todolistId: string) =>
    ({type: 'TODOLIST/DELETE-TODOLIST', todolistId}) as const
export const changeTodolistFilterAC = (todolistId: string, filter: TasksFiltersType) =>
    ({type: 'TODOLIST/CHANGE-TODOLIST-FILTER', todolistId, filter}) as const
export const changeTodolistTitleAC = (todolistId: string, title: string) =>
    ({type: 'TODOLIST/CHANGE-TODOLIST-TITLE', todolistId, title}) as const
export const addTodolistAC = (todolist: TodolistDomainType) =>
    ({type: 'TODOLIST/ADD-TODOLIST', todolist}) as const
export const setTodolistsAC = (todolists: TodolistDomainType[]) =>
    ({type: 'TODOLIST/SET-TODOLISTS', todolists}) as const
export const setEntityStatusAC = (todolistId: string, entityStatus: AppStatusesType) =>
    ({type: 'TODOLIST/SET-ENTITY-STATUS', todolistId, entityStatus}) as const

// thunks
export const fetchTodolistsTC = (): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setAppStatusAC('loading'))
            const res = await todolistAPI.getTodolists()
            dispatch(setTodolistsAC(res))
            dispatch(setAppStatusAC('completed'))
        } catch (e) {
            console.warn(e)
        }
    }
export const deleteTodolistTC = (todolistId: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setAppStatusAC('loading'))
            dispatch(setEntityStatusAC(todolistId, 'loading'))
            const res = await todolistAPI.deleteTodolist(todolistId)

            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(deleteTodolistAC(todolistId))
                dispatch(setAppStatusAC('completed'))
            } else {
                handleServerAppError<{}>(dispatch, res.data)
            }
        } catch (e: any) {
            dispatch(setEntityStatusAC(todolistId, 'idle'))
            handleServerNetworkError(dispatch, e)
        }
    }
export const createTodolistTC = (title: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setAppStatusAC('loading'))
            const res = await todolistAPI.createTodolist(title)
            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC('completed'))
            } else {
                handleServerAppError<{ item: TodolistDomainType }>(dispatch, res.data)
            }
        } catch (e: any) {
            handleServerNetworkError(dispatch, e)
        }
    }
export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(setAppStatusAC('loading'))
            const res = await todolistAPI.updateTodolist(todolistId, title)
            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(changeTodolistTitleAC(todolistId, title))
                dispatch(setAppStatusAC('completed'))
            } else {
                handleServerAppError<{}>(dispatch, res.data)
            }
        } catch (e: any) {
            handleServerNetworkError(dispatch, e)
        }
    }

// types
export type TodolistsActionTypes =
    | ReturnType<typeof deleteTodolistAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof setEntityStatusAC>

export type TodolistType = TodolistDomainType & {
    filter: TasksFiltersType
    entityStatus: AppStatusesType
}
