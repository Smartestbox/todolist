import { TasksFiltersType } from '../../components/App/App'
import { RESULT_CODE, todolistAPI, TodolistDomainType } from '../../api/todolist-api'
import { AppThunk } from '../../components/App/store'
import { appActions, AppStatusesType } from '../../components/App/app-reducer'
import { handleServerAppError, handleServerNetworkError } from '../../utils/handleServerNetworkError'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { clearTasksAndTodolists } from '../../common/actions/common-actions'
import { tasksThunks } from './tasks-reducer'

const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistType[],
    reducers: {
        deleteTodolist(state, action: PayloadAction<{ todolistId: string }>) {
            const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
            if (index != -1) {
                state.splice(index, 1)
            }
        },
        changeTodolistFilter(state, action: PayloadAction<{ id: string; filter: TasksFiltersType }>) {
            const index = state.findIndex((tl) => tl.id === action.payload.id)
            if (index != -1) {
                state[index].filter = action.payload.filter
            }
        },
        changeTodolistTitle(state, action: PayloadAction<{ todolistId: string; title: string }>) {
            const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
            if (index != -1) {
                state[index].title = action.payload.title
            }
        },
        addTodolist(state, action: PayloadAction<{ todolist: TodolistDomainType }>) {
            state.unshift({ ...action.payload.todolist, filter: 'All', entityStatus: 'idle' })
        },
        setEntityStatus(state, action: PayloadAction<{ todolistId: string; entityStatus: AppStatusesType }>) {
            const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.entityStatus
        },
        setTodolists(state, action: PayloadAction<{ todolists: TodolistDomainType[] }>) {
            action.payload.todolists.forEach((tl) => state.push({ ...tl, filter: 'All', entityStatus: 'idle' }))
        },
    },
    extraReducers(builder) {
        builder.addCase(clearTasksAndTodolists, () => {
            return []
        })
    },
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions

// export const clearDataAC = () => ({ type: "CLEAR-DATA" as const }) ---------------------------------------------------------------------

// thunks
export const fetchTodolistsTC = (): AppThunk => async (dispatch) => {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    try {
        const res = await todolistAPI.getTodolists()
        dispatch(todolistsActions.setTodolists({ todolists: res.data }))
        await res.data.forEach((tl) => dispatch(tasksThunks.fetchTasks(tl.id)))
        dispatch(appActions.setAppStatus({ status: 'completed' }))
    } catch (e) {
        console.warn(e)
    }
}
export const deleteTodolistTC =
    (todolistId: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            dispatch(todolistsActions.setEntityStatus({ todolistId, entityStatus: 'loading' }))
            const res = await todolistAPI.deleteTodolist(todolistId)

            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(todolistsActions.deleteTodolist({ todolistId }))
                dispatch(appActions.setAppStatus({ status: 'completed' }))
            } else {
                handleServerAppError<{}>(dispatch, res.data)
            }
        } catch (e: any) {
            dispatch(todolistsActions.setEntityStatus({ todolistId, entityStatus: 'idle' }))
            handleServerNetworkError(dispatch, e)
        }
    }
export const createTodolistTC =
    (title: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistAPI.createTodolist(title)
            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(todolistsActions.addTodolist({ todolist: res.data.data.item }))
            } else {
                handleServerAppError<{ item: TodolistDomainType }>(dispatch, res.data)
            }
        } catch (e: any) {
            handleServerNetworkError(dispatch, e)
        } finally {
            dispatch(appActions.setAppStatus({ status: 'completed' }))
        }
    }
export const changeTodolistTitleTC =
    (todolistId: string, title: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistAPI.updateTodolist(todolistId, title)
            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(todolistsActions.changeTodolistTitle({ todolistId, title }))
                dispatch(appActions.setAppStatus({ status: 'completed' }))
            } else {
                handleServerAppError<{}>(dispatch, res.data)
            }
        } catch (e: any) {
            handleServerNetworkError(dispatch, e)
        }
    }

// types

export type TodolistType = TodolistDomainType & {
    filter: TasksFiltersType
    entityStatus: AppStatusesType
}
