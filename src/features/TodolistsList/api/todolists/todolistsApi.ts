import { instance } from 'common/api/instance'
import { BaseResponseType } from 'common/types/BaseResponseType'
import {
    CreateTodolistResponseType,
    TodolistDomainType,
    UpdateTodolistResponseType,
} from 'features/TodolistsList/api/todolists/todolists.api.types'

export const todolistsAPI = {
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
}
