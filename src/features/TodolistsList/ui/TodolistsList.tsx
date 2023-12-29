import React, { useEffect } from 'react'
import { todolistsThunks, TodolistType } from 'features/TodolistsList/model/todolists/todolistsSlice'
import Grid from '@mui/material/Grid'
import { Paper } from '@mui/material'
import Todolist from 'features/TodolistsList/Todolist/Todolist'
import styles from 'app/App.module.css'
import { Navigate } from 'react-router-dom'
import { selectIsLoggedIn } from 'features/auth/model/authSelectors'
import { selectTodolists } from 'features/TodolistsList/model/todolists/todolistsSelectors'
import { useAppSelector } from 'common/hooks'
import { useAppDispatch } from 'common/hooks/useAppDispatch'
import { AddItemForm } from 'common/components'

export const TodolistsList: React.FC = () => {
    const todolists = useAppSelector<TodolistType[]>(selectTodolists)
    const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isLoggedIn) return
        dispatch(todolistsThunks.fetchTodolists())
    }, [])

    const addTodolist = (title: string) => {
        return dispatch(todolistsThunks.createTodolist({ title })).unwrap()
    }

    if (!isLoggedIn) {
        return <Navigate to={'/login'} />
    }

    return (
        <div>
            <div className={styles.addTodolistForm}>
                <AddItemForm label={'Add todolist'} addItem={addTodolist} fullWidth={true} />
            </div>
            <Grid container spacing={2}>
                {todolists.map((tl) => (
                    <Grid item key={tl.id}>
                        <Paper elevation={3} sx={{ padding: '20px' }}>
                            <Todolist todolist={tl} entityStatus={tl.entityStatus} />
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}
