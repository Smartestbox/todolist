import React, { useEffect, useState } from 'react'
import { todolistsAPI } from 'features/TodolistsList/api/todolists/todolistsApi'

export default {
    title: 'HTTP requests',
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        todolistsAPI.getTodolists().then((res) => {
            setState(res)
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    const title = 'new title'

    useEffect(() => {
        todolistsAPI.createTodolist(title).then((res) => {
            setState(res.data)
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        const todolistId = '0a466137-6d99-4ec0-80f5-d3ebc117aa5f'
        todolistsAPI.deleteTodolist(todolistId).then((res) => {
            setState(res.data)
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolist = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        const todolistId = 'a2f2f191-aceb-460e-9607-4c27c5a9e5df'
        const title = 'upd title 2'

        todolistsAPI.updateTodolist(todolistId, title).then((res) => {
            setState(res.data)
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
