import { instance } from 'common/api/instance'
import { BaseResponseType } from 'common/types/BaseResponseType'
import {
    CreateTodolistResponseType,
    GetTasksResponseType,
    TaskDomainType,
    TodolistDomainType,
    UpdateTodolistResponseType,
} from 'features/TodolistsList/api/todolistsList.api.types'

export const todolistAPI = {
    getTodolists() {
        return instance.get<TodolistDomainType[]>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<CreateTodolistResponseType>('todo-lists', { title })
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<BaseResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<UpdateTodolistResponseType>(`todo-lists/${todolistId}`, { title })
    },
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
