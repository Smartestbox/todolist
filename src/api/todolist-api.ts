import axios from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true
})

export const todolistAPI = {
    getTodolists() {
        return instance.get<TodolistDomainType[]>('todo-lists')
            .then(res => res.data)
    },
    createTodolist(title: string) {
        return instance.post<CreateTodolistResponseType>(
            'todo-lists', {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<TodolistsResponseType>(
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
        return instance.post<TasksResponseType<{item: TaskDomainType}>>(`/todo-lists/${todolistId}/tasks`, {title})
    },
    deleteTask(todolistId: string, taskId: string) {
      return instance.delete<TasksResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, task: TaskDomainType) {
        return instance.put<TasksResponseType<{item: TaskDomainType}>>(`/todo-lists/${todolistId}/tasks/${taskId}`, task)
    }
}

// Todolist types----------------------------------

export type TodolistDomainType = {
    id: string
    title: string
    addedDate: string
    order: number
}

type TodolistsResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    data: D
}

type UpdateTodolistResponseType = ResponseType & {
    fieldsErrors: string[]
}

type CreateTodolistResponseType = TodolistsResponseType<{item: TodolistDomainType}>

// Task types---------------------------------------

export type TaskDomainType = {
    id: string
    title: string
    description: string
    todoListId: string
    order: number
    status: TaskStatuses
    priority: TaskPriorities
    startDate: ''
    deadline: ''
    addedDate: ''
}

export type TasksResponseType<D = {}> = {
    data: D
    message: string[]
    fieldsErrors: string[]
    resultCode: number
}

export type GetTasksResponseType = {
    items: TaskDomainType[]
    totalCount: number
    error: string
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