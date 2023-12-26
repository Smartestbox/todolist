import { TaskPriorities, TaskStatuses } from 'common/enums'
import { BaseResponseType } from 'common/types/BaseResponseType'

export type TodolistDomainType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type UpdateTodolistResponseType = BaseResponseType & {
    fieldsErrors: string[]
}
export type CreateTodolistResponseType = BaseResponseType<{ item: TodolistDomainType }>
