import React, {useCallback, useEffect} from 'react'
import styles from '../../styles/App.module.css'
import AddItemForm from "../AddItemForm/AddItemForm";
import Todolist from "../Todolist/Todolist";
import {
    AddTodolistAC, fetchTodolistsTC,
    TodolistType
} from "../../state/todolists-reducer";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../../state/store";
import Grid from '@mui/material/Grid';
import {Paper} from "@mui/material";

export type TasksFiltersType = 'All' | 'Completed' | 'Active'

const App = () => {

    const todolists = useSelector<AppRootStateType, TodolistType[]>(state => state.todolists)

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [])

    const addTodolist = useCallback((title: string) => {
        const action = AddTodolistAC(title)
        dispatch(action)
    }, [dispatch])

    return (
        <div className={styles.app}>
            <div className={styles.addTodolistForm}>
                <AddItemForm label={'Add todolist'} addItem={addTodolist} fullWidth={true}/>
            </div>
                <Grid container spacing={2}>
                    {
                        todolists.map(tl =>
                            <Grid item key={tl.id}>
                                <Paper elevation={3} sx={{padding: '20px'}}>
                                    <Todolist
                                        todolist={tl}
                                    />
                                </Paper>
                            </Grid>
                        )
                    }
                </Grid>
        </div>
    );
};

export default App;



