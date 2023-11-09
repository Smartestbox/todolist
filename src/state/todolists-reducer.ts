import {TasksFiltersType} from "../components/App/App";
import {v1} from "uuid";
import {todolistAPI, TodolistDomainType} from "../api/todolist-api";
import {Dispatch} from "redux";

export type TodolistsActionTypes =
    | ReturnType<typeof RemoveTodolistAC>
    | ReturnType<typeof ChangeTodolistFilterAC>
    | ReturnType<typeof ChangeTodolistTitleAC>
    | ReturnType<typeof AddTodolistAC>
    | ReturnType<typeof SetTodolistsAC>

export type TodolistType = TodolistDomainType & {
    filter: TasksFiltersType
}

const initialState: TodolistType[] = []

export const todolistsReducer = (state: TodolistType[] = initialState, action: TodolistsActionTypes): TodolistType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todolistId)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.todolistId ? {...tl, filter: action.filter} : tl)
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.todolistId ? {...tl, title: action.title} : tl)
        case 'ADD-TODOLIST':
            return [...state, {id: action.todolistId, title: action.title, addedDate: '', order: 0, filter: 'All'}]
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'All'}))
        default:
            return state
    }
}

export const RemoveTodolistAC = (todolistId: string) =>
    ({type: 'REMOVE-TODOLIST', todolistId}) as const

export const ChangeTodolistFilterAC = (todolistId: string, filter: TasksFiltersType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', todolistId, filter}) as const

export const ChangeTodolistTitleAC = (todolistId: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', todolistId, title}) as const

export const AddTodolistAC = (title: string) =>
    ({type: 'ADD-TODOLIST', todolistId: v1(), title}) as const

export const SetTodolistsAC = (todolists: TodolistDomainType[]) =>
    ({type: 'SET-TODOLISTS', todolists}) as const

//------------THUNK-------------------

export const fetchTodolistsTC = () =>
    (dispatch: Dispatch) => {
        todolistAPI.getTodolists()
            .then(res => {
                dispatch(SetTodolistsAC(res))
            })
    }

