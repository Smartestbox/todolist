import React, { useCallback, useEffect } from "react"
import { useSelector } from "react-redux"
import { RootStateType, useAppDispatch, useAppSelector } from "../../components/App/store"
import { createTodolistTC, fetchTodolistsTC, TodolistType } from "./todolists-reducer"
import Grid from "@mui/material/Grid"
import { Paper } from "@mui/material"
import Todolist from "./Todolist/Todolist"
import styles from "../../components/App/App.module.css"
import AddItemForm from "../../components/AddItemForm/AddItemForm"
import { Navigate } from "react-router-dom"
import { selectIsLoggedIn } from "../Login/auth-selectors"
import { selectTodolists } from "./todolists-selectors"

const TodolistsList: React.FC = () => {
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
        return <Navigate to={"/login"} />
    }

    return (
        <div>
            <div className={styles.addTodolistForm}>
                <AddItemForm label={"Add todolist"} addItem={addTodolist} fullWidth={true} />
            </div>
            <Grid container spacing={2}>
                {todolists.map((tl) => (
                    <Grid item key={tl.id}>
                        <Paper elevation={3} sx={{ padding: "20px" }}>
                            <Todolist todolist={tl} entityStatus={tl.entityStatus} />
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}

export default TodolistsList
