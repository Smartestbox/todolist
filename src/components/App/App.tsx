import React from 'react'
import styles from './App.module.css'
import {RootStateType} from "./store";
import TodolistsList from "../../features/TodolistsList/TodolistsList";
import {LinearProgress} from "@mui/material";
import {ErrorSnackbar} from "../ErrorSnackbar/ErrorSnackbar";
import {useSelector} from "react-redux";
import {AppStatusesType} from "./app-reducer";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../../features/Login/Login";

export type TasksFiltersType = 'All' | 'Completed' | 'Active'

const App = () => {
    const status = useSelector<RootStateType, AppStatusesType>(state => state.app.status)

    return (
        <div className={styles.app}>
            {
                status === 'loading' &&
                <LinearProgress
                    sx={{position: 'absolute', top: '0', right: '0', left: '0'}}
                    color={'primary'}
                />
            }
            <ErrorSnackbar/>
            <Routes>
                <Route path={'/'} element={<TodolistsList/>}/>
                <Route path={'/login'} element={<Login/>}/>

                <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                <Route path={'/404'} element={<h1>404: PAGE NOT FOUND</h1>}/>
            </Routes>

        </div>
    );
};

export default App;



