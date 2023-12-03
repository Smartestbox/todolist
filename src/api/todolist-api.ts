import axios from "axios";
import {LoginDataType} from "../features/Login/Login";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true
})

// api
export const authAPI = {
    me() {
        return instance.get<ResponseType<UserType>>('auth/me')
    },
    login(loginData: LoginDataType) {
        return instance.post<ResponseType<{ userId: number }>>('auth/login', loginData)
    },
    logout() {
        return instance.delete<ResponseType>('auth/login')
    }
}

export const todolistAPI = {
    getTodolists() {
        return instance.get<TodolistDomainType[]>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<CreateTodolistResponseType>(
            'todo-lists', {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(
            `todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<UpdateTodolistResponseType>(
            `todo-lists/${todolistId}`, {title})
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponseType>(`/todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskDomainType }>>(`/todo-lists/${todolistId}/tasks`, {title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, task: TaskDomainType) {
        return instance.put<ResponseType<{ item: TaskDomainType }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, task)
    }
}

// Todolist types
export type TodolistDomainType = {
    id: string
    title: string
    addedDate: string
    order: number
}

type UpdateTodolistResponseType = ResponseType & {
    fieldsErrors: string[]
}
type CreateTodolistResponseType = ResponseType<{ item: TodolistDomainType }>

// Task types
export type TaskDomainType = {
    id: string
    title: string
    description: string
    todoListId: string
    order: number
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    addedDate: string
}
export type ResponseType<D = {}> = {
    data: D
    messages: string[]
    fieldsErrors: string[]
    resultCode: number
}
export type GetTasksResponseType = {
    items: TaskDomainType[]
    totalCount: number
    error: null | string
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    High = 2,
    Urgently = 3,
    Later = 4
}

export enum RESULT_CODE {
    SUCCEEDED = 0,
    FAILED = 1,
    CAPTURE_FAILED = 10
}

// User types
type UserType = {
    id: number
    email: string
    login: string
}