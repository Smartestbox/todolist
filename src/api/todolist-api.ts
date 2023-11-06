import axios from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true
})

export const todolistAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists')
            .then(res => res.data)
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
    }
}

type TodolistType = {
    id: string
    title: string
    addedDate: Date
    order: number
}

type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    data: D
}

type UpdateTodolistResponseType = ResponseType & {
    fieldsErrors: string[]
}

type CreateTodolistResponseType = ResponseType<{item: TodolistType}>