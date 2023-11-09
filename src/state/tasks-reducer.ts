import {v1} from "uuid";
import {AddTodolistAC, RemoveTodolistAC, SetTodolistsAC} from "./todolists-reducer";
import {TaskDomainType, TaskPriorities, TaskStatuses, todolistAPI} from "../api/todolist-api";
import {Dispatch} from "redux";
import task from "../components/Task/Task";

type TasksActionTypes =
    | ReturnType<typeof ChangeTaskStatusAC>
    | ReturnType<typeof AddTaskAC>
    | ReturnType<typeof RemoveTaskAC>
    | ReturnType<typeof ChangeTaskTitleAC>
    | ReturnType<typeof ChangeTaskTitleAC>
    | ReturnType<typeof RemoveTodolistAC>
    | ReturnType<typeof AddTodolistAC>
    | ReturnType<typeof SetTodolistsAC>
    | ReturnType<typeof SetTasksAC>

export type TasksType = {
    [key: string]: TaskDomainType[]
}

const initialState: TasksType = {}

export const tasksReducer = (state: TasksType = initialState, action: TasksActionTypes): TasksType => {
    switch (action.type) {
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(task => task.id === action.taskId
                    ? {...task, status: action.taskStatus}
                    : task)
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.task.todoListId]: [
                    action.task,
                    ...state[action.task.todoListId]
                ]
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
        case 'SET-TASKS': {
            return {...state, [action.todolistId]: action.tasks}
        }
        default:
            return state
    }
}

export const ChangeTaskStatusAC = (todolistId: string, taskId: string, taskStatus: TaskStatuses) =>
    ({type: 'CHANGE-TASK-STATUS', todolistId, taskId, taskStatus}) as const

export const AddTaskAC = (task: TaskDomainType) =>
    ({type: 'ADD-TASK', task}) as const

export const RemoveTaskAC = (todolistId: string, taskId: string) =>
    ({type: 'REMOVE-TASK', todolistId, taskId}) as const

export const ChangeTaskTitleAC = (todolistId: string, taskId: string, title: string) =>
    ({type: 'CHANGE-TASK-TITLE', todolistId, taskId, title}) as const


export const SetTasksAC = (todolistId: string, tasks: TaskDomainType[]) =>
    ({type: 'SET-TASKS', todolistId, tasks}) as const


//------------THUNK-------------------

export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        todolistAPI.getTasks(todolistId)
            .then(res => {
                dispatch(SetTasksAC(todolistId, res.data.items))
            })
    }
}

export const deleteTaskTC = (todolistId: string, taskId: string) =>
    (dispatch: Dispatch) => {
        todolistAPI.deleteTask(todolistId, taskId)
            .then(res => {
                dispatch(RemoveTaskAC(todolistId, taskId))
            })
    }

    export const addTaskTC = (todolistId: string, title: string) =>
        (dispatch: Dispatch) => {
            todolistAPI.createTask(todolistId, title)
                .then(res => {
                    dispatch(AddTaskAC(res.data.data.item))
                })
        }