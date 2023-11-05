import {TasksType} from "../components/App/App";
import {v1} from "uuid";
import {AddTodolistAC, RemoveTodolistAC} from "./todolists-reducer";

type TasksActionTypes =
    | ReturnType<typeof ChangeTaskStatusAC>
    | ReturnType<typeof AddTaskAC>
    | ReturnType<typeof RemoveTaskAC>
    | ReturnType<typeof ChangeTaskTitleAC>
    | ReturnType<typeof ChangeTaskTitleAC>
    | ReturnType<typeof RemoveTodolistAC>
    | ReturnType<typeof AddTodolistAC>

const initialState: TasksType = {}

export const tasksReducer = (state: TasksType = initialState, action: TasksActionTypes) => {
    switch(action.type) {
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(task => task.id === action.taskId
                    ? {...task, isDone: action.taskStatus}
                    : task)
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.todolistId]: [{id: v1(), title: action.title, isDone: false}, ...state[action.todolistId]]
            }
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(task => task.id !== action.taskId)
            }
        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(task => task.id === action.taskId
                    ? {...task, title: action.title}
                    : task)
            }
        case 'REMOVE-TODOLIST': {
            let newState = {...state}
            delete newState[action.todolistId]
            return newState
        }
        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.todolistId]: []
            }
        default:
            return state
    }
}

export const ChangeTaskStatusAC = (todolistId: string, taskId: string, taskStatus: boolean) =>
    ({type: 'CHANGE-TASK-STATUS', todolistId, taskId, taskStatus}) as const

export const AddTaskAC = (todolistId: string, title: string) =>
    ({type: 'ADD-TASK', todolistId, title}) as const

export const RemoveTaskAC = (todolistId: string, taskId: string) =>
    ({type: 'REMOVE-TASK', todolistId, taskId}) as const

export const ChangeTaskTitleAC = (todolistId: string, taskId: string, title: string) =>
    ({type: 'CHANGE-TASK-TITLE', todolistId, taskId, title}) as const