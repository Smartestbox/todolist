import React, {useCallback} from 'react'
import styles from './App.module.css'
import AddItemForm from "../AddItemForm/AddItemForm";
import {addTodolistTC} from "../../features/TodolistsList/todolists-reducer";
import {RootStateType, useAppDispatch} from "./store";
import TodolistsList from "../../features/TodolistsList/TodolistsList";
import {LinearProgress} from "@mui/material";
import {ErrorSnackbar} from "../ErrorSnackbar/ErrorSnackbar";
import {useSelector} from "react-redux";
import {AppStatusesType} from "./app-reducer";

export type TasksFiltersType = 'All' | 'Completed' | 'Active'

const App = () => {
    const status = useSelector<RootStateType, AppStatusesType>(state => state.app.status)
    const dispatch = useAppDispatch()

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])

    return (
        <div className={styles.app}>
            {
                status === 'loading' &&
                <LinearProgress
                    sx={{position: 'absolute', top: '0', right: '0', left: '0'}}
                    color={'primary'}
                />
            }
            <ErrorSnackbar />
            <div className={styles.addTodolistForm}>
                <AddItemForm label={'Add todolist'} addItem={addTodolist} fullWidth={true}/>
            </div>
            <TodolistsList />
        </div>
    );
};

export default App;



