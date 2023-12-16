import React, { useCallback, useEffect } from 'react'
import { createTodolistTC, fetchTodolistsTC, TodolistType } from './todolistsSlice'
import Grid from '@mui/material/Grid'
import { Paper } from '@mui/material'
import Todolist from './Todolist/Todolist'
import styles from '../../app/App.module.css'
import { Navigate } from 'react-router-dom'
import { selectIsLoggedIn } from 'features/auth/model/authSelectors'
import { selectTodolists } from './todolistsSelectors'
import { useAppSelector } from 'common/hooks'
import { useAppDispatch } from 'common/hooks/useAppDispatch'
import { AddItemForm } from 'common/components'

export const TodolistsList: React.FC = () => {
    const todolists = useAppSelector<TodolistType[]>(selectTodolists)
    const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isLoggedIn) return
        dispatch(fetchTodolistsTC())
    }, [])

    const addTodolist = useCallback(
        (title: string) => {
            dispatch(createTodolistTC(title))
        },
        [dispatch],
    )

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
