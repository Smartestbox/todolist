import { RESULT_CODE, TaskDomainType, TaskPriorities, TaskStatuses, todolistAPI } from '../../api/todolist-api'
import { AppThunk } from '../../app/store'
import { appActions, AppStatusesType } from '../../app/app-reducer'
import { handleServerNetworkError } from '../../common/utils/handleServerNetworkError'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { todolistsActions } from './todolists-reducer'
import { clearTasksAndTodolists } from '../../common/actions/common-actions'
import { createAppAsyncThunk } from '../../common/utils/createAppAsyncThunk'
import { handleServerAppError } from '../../common/utils/handleServerAppError'

// Thunks
const fetchTasks = createAppAsyncThunk<{ todolistId: string; tasks: TaskDomainType[] }, string>(
    'tasks/fetchTasks',
    async (todolistId, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistAPI.getTasks(todolistId)
            dispatch(appActions.setAppStatus({ status: 'completed' }))
            return { todolistId, tasks: res.data.items }
        } catch (e) {
            handleServerNetworkError(dispatch, e)
            return rejectWithValue(null)
        }
    },
)

const addTask = createAppAsyncThunk<{ task: TaskDomainType }, { todolistId: string; title: string }>(
    'tasks/addTask',
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistAPI.createTask(arg.todolistId, arg.title)
            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(appActions.setAppStatus({ status: 'completed' }))
                return { task: res.data.data.item }
            } else {
                handleServerAppError<{ item: TaskDomainType }>(dispatch, res.data)
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(dispatch, e)
            return rejectWithValue(null)
        }
    },
)

const updateTask = createAppAsyncThunk<
    {
        todolistId: string
        taskId: string
        taskForUpdate: TaskDomainType
    },
    {
        todolistId: string
        taskId: string
        taskModelWithOnlyUpdatedProperties: TaskWithOnlyUpdatedFieldsType
    }
>('tasks/updateTask', async (arg, thunkAPI) => {
    const { dispatch, getState, rejectWithValue } = thunkAPI
    try {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        dispatch(
            tasksActions.setTaskEntityStatus({
                todolistId: arg.todolistId,
                taskId: arg.taskId,
                entityStatus: 'loading',
            }),
        )

        const taskFromRedux = getState().tasks[arg.todolistId].find((t) => t.id === arg.taskId)

        if (!taskFromRedux) {
            console.warn('task was not found')
            return rejectWithValue(null)
        }

        let { entityStatus, ...taskForUpdate } = taskFromRedux
        taskForUpdate = { ...taskForUpdate, ...arg.taskModelWithOnlyUpdatedProperties }

        // const taskForUpdate = {
        //     ...taskFromRedux,
        //     ...arg.taskModelWithOnlyUpdatedProperties,
        // }

        const res = await todolistAPI.updateTask(arg.todolistId, arg.taskId, taskForUpdate)

        if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
            dispatch(appActions.setAppStatus({ status: 'completed' }))
            dispatch(
                tasksActions.setTaskEntityStatus({
                    todolistId: arg.todolistId,
                    taskId: arg.taskId,
                    entityStatus: 'completed',
                }),
            )
            return { todolistId: arg.todolistId, taskId: arg.taskId, taskForUpdate }
        } else {
            handleServerAppError<{ item: TaskDomainType }>(dispatch, res.data)
            dispatch(
                tasksActions.setTaskEntityStatus({
                    todolistId: arg.todolistId,
                    taskId: arg.taskId,
                    entityStatus: 'failed',
                }),
            )
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(dispatch, e)
        return rejectWithValue(null)
    }
})

const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksType,
    reducers: {
        deleteTask(state, action: PayloadAction<{ todolistId: string; taskId: string }>) {
            const index = state[action.payload.todolistId].findIndex((task) => task.id === action.payload.taskId)
            if (index !== -1) {
                state[action.payload.todolistId].splice(index, 1)
            }
        },
        setTaskEntityStatus(
            state,
            action: PayloadAction<{
                todolistId: string
                taskId: string
                entityStatus: AppStatusesType
            }>,
        ) {
            const index = state[action.payload.todolistId].findIndex((task) => task.id === action.payload.taskId)
            state[action.payload.todolistId][index].entityStatus = action.payload.entityStatus
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state[action.payload.todolistId].findIndex((task) => task.id === action.payload.taskId)

                if (index !== -1) {
                    state[action.payload.todolistId][index] = {
                        ...state[action.payload.todolistId][index],
                        ...action.payload.taskForUpdate,
                    }
                }
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                action.payload.tasks.forEach((task) => {
                    state[action.payload.todolistId].push({ ...task, entityStatus: 'idle' })
                })
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift({ ...action.payload.task, entityStatus: 'idle' })
            })
            .addCase(todolistsActions.addTodolist, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsActions.deleteTodolist, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(todolistsActions.setTodolists, (state, action) => {
                action.payload.todolists.forEach((tl) => {
                    state[tl.id] = []
                })
            })
            .addCase(clearTasksAndTodolists, () => {
                return {}
            })
    },
})

export const deleteTaskTC =
    (todolistId: string, taskId: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            dispatch(tasksActions.setTaskEntityStatus({ todolistId, taskId, entityStatus: 'loading' }))
            const res = await todolistAPI.deleteTask(todolistId, taskId)
            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(tasksActions.deleteTask({ todolistId, taskId }))
                dispatch(appActions.setAppStatus({ status: 'completed' }))
            } else {
                handleServerAppError<{}>(dispatch, res.data)
            }
        } catch (e: any) {
            dispatch(tasksActions.setTaskEntityStatus({ todolistId, taskId, entityStatus: 'idle' }))
            handleServerNetworkError(dispatch, e)
        }
    }

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = { fetchTasks, addTask, updateTask }

// types

export type TasksType = {
    [key: string]: TaskType[]
}

export type TaskType = TaskDomainType & {
    entityStatus: AppStatusesType
}

export type TaskWithOnlyUpdatedFieldsType = {
    id?: string
    title?: string
    description?: string
    todoListId?: string
    order?: number
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
    addedDate?: string
}
