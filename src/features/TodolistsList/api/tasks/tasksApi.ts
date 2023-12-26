import { instance } from 'common/api/instance'
import { BaseResponseType } from 'common/types/BaseResponseType'
import { GetTasksResponseType, TaskDomainType } from 'features/TodolistsList/api/tasks/tasks.api.types'

export const tasksAPI = {
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponseType>(`/todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<BaseResponseType<{ item: TaskDomainType }>>(`/todo-lists/${todolistId}/tasks`, { title })
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<BaseResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, task: TaskDomainType) {
        return instance.put<BaseResponseType<{ item: TaskDomainType }>>(
            `/todo-lists/${todolistId}/tasks/${taskId}`,
            task,
        )
    },
}
