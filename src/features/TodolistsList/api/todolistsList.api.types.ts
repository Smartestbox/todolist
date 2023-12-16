import { TaskPriorities, TaskStatuses } from 'common/enums'
import { ResponseType } from 'common/types/responseType'

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

export type GetTasksResponseType = {
    items: TaskDomainType[]
    totalCount: number
    error: null | string
}

export type TodolistDomainType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type UpdateTodolistResponseType = ResponseType & {
    fieldsErrors: string[]
}
export type CreateTodolistResponseType = ResponseType<{ item: TodolistDomainType }>