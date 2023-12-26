import { TaskPriorities, TaskStatuses } from 'common/enums'

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
