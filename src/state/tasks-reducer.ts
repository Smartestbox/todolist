import {v1} from "uuid";
import {AddTodolistAC, RemoveTodolistAC, SetTodolistsAC} from "./todolists-reducer";
import {TasksType} from "./tasks-reducer.test";
import {GetTasksResponseType} from "../api/todolist-api";

type TasksActionTypes =
    | ReturnType<typeof ChangeTaskStatusAC>
    | ReturnType<typeof AddTaskAC>
    | ReturnType<typeof RemoveTaskAC>
    | ReturnType<typeof ChangeTaskTitleAC>
    | ReturnType<typeof ChangeTaskTitleAC>
    | ReturnType<typeof RemoveTodolistAC>
    | ReturnType<typeof AddTodolistAC>
    | ReturnType<typeof SetTodolistsAC>

const initialState: TasksType = {}

export const tasksReducer = (state: TasksType = initialState, action: TasksActionTypes): TasksType => {
    switch (action.type) {
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
        case 'SET-TODOLISTS': {
            let stateCopy = state
            action.todolists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
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

//------------THUNK-------------------

export const SetTasksTC = (todolistId: string, tasks: GetTasksResponseType) =>
    ({
        type: 'SET-TASKS',
        todolistId,
        tasks
    }) as const