import {TasksFiltersType} from "../../components/App/App";
import {todolistAPI, TodolistDomainType} from "../../api/todolist-api";
import {Dispatch} from "redux";

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
            return [{...action.todolist, filter: 'All'}, ...state]
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'All'}))
        default:
            return state
    }
}

// actions
export const RemoveTodolistAC = (todolistId: string) =>
    ({type: 'REMOVE-TODOLIST', todolistId}) as const
export const ChangeTodolistFilterAC = (todolistId: string, filter: TasksFiltersType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', todolistId, filter}) as const
export const ChangeTodolistTitleAC = (todolistId: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', todolistId, title}) as const
export const AddTodolistAC = (todolist: TodolistDomainType) =>
    ({type: 'ADD-TODOLIST', todolist}) as const
export const SetTodolistsAC = (todolists: TodolistDomainType[]) =>
    ({type: 'SET-TODOLISTS', todolists}) as const

// thunks
export const fetchTodolistsTC = () =>
    (dispatch: Dispatch) => {
        todolistAPI.getTodolists()
            .then(res => {
                dispatch(SetTodolistsAC(res))
            })
    }
export const deleteTodolistTC = (todolistId: string) =>
    (dispatch: Dispatch) => {
        todolistAPI.deleteTodolist(todolistId)
            .then(res => {
                dispatch(RemoveTodolistAC(todolistId))
            })
    }
export const addTodolistTC = (title: string) =>
    (dispatch: Dispatch) => {
        todolistAPI.createTodolist(title)
            .then(res => {
                dispatch(AddTodolistAC(res.data.data.item))
            })
    }
export const changeTodolistTitleTC = (todolistId: string, title: string) =>
    (dispatch: Dispatch) => {
        todolistAPI.updateTodolist(todolistId, title)
            .then(res => {
                dispatch(ChangeTodolistTitleAC(todolistId, title))
            })
    }

// types
export type TodolistsActionTypes =
    | ReturnType<typeof RemoveTodolistAC>
    | ReturnType<typeof ChangeTodolistFilterAC>
    | ReturnType<typeof ChangeTodolistTitleAC>
    | ReturnType<typeof AddTodolistAC>
    | ReturnType<typeof SetTodolistsAC>
export type TodolistType = TodolistDomainType & {
    filter: TasksFiltersType
}
