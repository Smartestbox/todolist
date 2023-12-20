import { appActions, AppStatusesType } from 'app/model/appSlice'
import { createAppAsyncThunk, handleServerNetworkError } from 'common/utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { clearTasksAndTodolists } from 'common/actions/commonActions'
import { handleServerAppError } from 'common/utils'
import { TodolistDomainType } from 'features/TodolistsList/api/todolistsList.api.types'
import { todolistAPI } from 'features/TodolistsList/api/todolistsListApi'
import { RESULT_CODE } from 'common/enums'
import { thunkTryCatch } from 'common/utils/thunkTryCatch'

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistDomainType[] }, undefined>(
    'todolists/fetchTodolists',
    async (_, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        try {
            const res = await todolistAPI.getTodolists()

            dispatch(appActions.setAppStatus({ status: 'completed' }))
            return { todolists: res.data }
        } catch (e) {
            handleServerNetworkError(dispatch, e)
            return rejectWithValue(null)
        }
    },
)

const deleteTodolist = createAppAsyncThunk<{ todolistId: string }, { todolistId: string }>(
    'todolists/deleteTodolist',
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            dispatch(todolistsActions.setEntityStatus({ todolistId: arg.todolistId, entityStatus: 'loading' }))
            const res = await todolistAPI.deleteTodolist(arg.todolistId)

            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(appActions.setAppStatus({ status: 'completed' }))
                return { todolistId: arg.todolistId }
            } else {
                handleServerAppError<{}>(dispatch, res.data)
                dispatch(todolistsActions.setEntityStatus({ todolistId: arg.todolistId, entityStatus: 'failed' }))
                return rejectWithValue(null)
            }
        } catch (e: any) {
            dispatch(todolistsActions.setEntityStatus({ todolistId: arg.todolistId, entityStatus: 'failed' }))
            handleServerNetworkError(dispatch, e)
            return rejectWithValue(null)
        }
    },
)

const createTodolist = createAppAsyncThunk<{ todolist: TodolistDomainType }, { title: string }>(
    'todolists/createTodolist',
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        return thunkTryCatch(thunkAPI, async () => {
            const res = await todolistAPI.createTodolist(arg.title)
            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(appActions.setAppStatus({ status: 'completed' }))
                return { todolist: res.data.data.item }
            } else {
                handleServerAppError<{ item: TodolistDomainType }>(dispatch, res.data)
                dispatch(appActions.setAppStatus({ status: 'failed' }))
                return rejectWithValue(null)
            }
        })
    },
)

const changeTodolistTitle = createAppAsyncThunk<
    { todolistId: string; title: string },
    { todolistId: string; title: string }
>('todolists/changeTodolistTitle', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        const res = await todolistAPI.updateTodolist(arg.todolistId, arg.title)
        if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
            dispatch(appActions.setAppStatus({ status: 'completed' }))
            return { todolistId: arg.todolistId, title: arg.title }
        } else {
            handleServerAppError<{}>(dispatch, res.data)
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(dispatch, e)
        return rejectWithValue(null)
    }
})

const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistType[],
    reducers: {
        changeTodolistFilter(state, action: PayloadAction<{ id: string; filter: TasksFiltersType }>) {
            const index = state.findIndex((tl) => tl.id === action.payload.id)
            if (index !== -1) {
                state[index].filter = action.payload.filter
            }
        },
        setEntityStatus(state, action: PayloadAction<{ todolistId: string; entityStatus: AppStatusesType }>) {
            const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.entityStatus
        },
    },
    extraReducers(builder) {
        builder
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
                if (index !== -1) {
                    state[index].title = action.payload.title
                }
            })
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach((tl) => state.push({ ...tl, filter: 'All', entityStatus: 'idle' }))
            })
            .addCase(deleteTodolist.fulfilled, (state, action) => {
                const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
                if (index !== -1) {
                    state.splice(index, 1)
                }
            })
            .addCase(createTodolist.fulfilled, (state, action) => {
                state.unshift({ ...action.payload.todolist, filter: 'All', entityStatus: 'idle' })
            })
            .addCase(clearTasksAndTodolists, () => {
                return []
            })
    },
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = { fetchTodolists, deleteTodolist, createTodolist, changeTodolistTitle }

// types

export type TodolistType = TodolistDomainType & {
    filter: TasksFiltersType
    entityStatus: AppStatusesType
}

export type TasksFiltersType = 'All' | 'Completed' | 'Active'
