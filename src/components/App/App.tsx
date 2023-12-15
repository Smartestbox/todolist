import React, { useEffect } from 'react'
import styles from './App.module.css'
import { useAppDispatch, useAppSelector } from './store'
import TodolistsList from '../../features/TodolistsList/TodolistsList'
import { AppBar, Button, CircularProgress, LinearProgress, Toolbar } from '@mui/material'
import { ErrorSnackbar } from '../ErrorSnackbar/ErrorSnackbar'
import { AppStatusesType } from './app-reducer'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Login } from '../../features/Login/Login'
import { logoutTC, meTC } from '../../features/Login/auth-reducer'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { selectAppIsInitialized, selectAppStatus } from './app-selectors'
import { selectIsLoggedIn } from '../../features/Login/auth-selectors'

export type TasksFiltersType = 'All' | 'Completed' | 'Active'

const App = () => {
    const status = useAppSelector<AppStatusesType>(selectAppStatus)
    const isInitialized = useAppSelector<boolean>(selectAppIsInitialized)
    const isLoggedIn = useAppSelector(selectIsLoggedIn)

    const dispatch = useAppDispatch()

    const logout = () => {
        dispatch(logoutTC())
    }

    useEffect(() => {
        dispatch(meTC())
    }, [])

    if (!isInitialized) {
        return (
            <div
                style={{
                    position: 'fixed',
                    top: '30%',
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                <CircularProgress />
            </div>
        )
    }

    return (
        <div className={styles.app}>
            {status === 'loading' && (
                <LinearProgress sx={{ position: 'absolute', top: '0', right: '0', left: '0' }} color={'primary'} />
            )}
            <AppBar position="static">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    {isLoggedIn && (
                        <Button color="inherit" onClick={logout}>
                            Logout
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
            <ErrorSnackbar />
            <Routes>
                <Route path={'/'} element={<TodolistsList />} />
                <Route path={'/login'} element={<Login />} />

                <Route path={'*'} element={<Navigate to={'/404'} />} />
                <Route path={'/404'} element={<h1>404: PAGE NOT FOUND</h1>} />
            </Routes>
        </div>
    )
}

export default App
