import React, {useCallback} from 'react'
import styles from './App.module.css'
import AddItemForm from "../AddItemForm/AddItemForm";
import {addTodolistTC} from "../../features/TodolistsList/todolists-reducer";
import {useAppDispatch} from "./store";
import TodolistsList from "../../features/TodolistsList/TodolistsList";

export type TasksFiltersType = 'All' | 'Completed' | 'Active'

const App = () => {
    const dispatch = useAppDispatch()

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])


    return (
        <div className={styles.app}>
            <div className={styles.addTodolistForm}>
                <AddItemForm label={'Add todolist'} addItem={addTodolist} fullWidth={true}/>
            </div>
            <TodolistsList />
        </div>
    );
};

export default App;



