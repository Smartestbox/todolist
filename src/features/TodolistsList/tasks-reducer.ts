import { RESULT_CODE, TaskDomainType, TaskPriorities, TaskStatuses, todolistAPI } from "../../api/todolist-api"
import { AppThunk } from "../../components/App/store"
import { appActions, AppStatusesType } from "../../components/App/app-reducer"
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { todolistsActions } from "./todolists-reducer"
import { clearTasksAndTodolists } from "../../common/actions/common.actions"

const slice = createSlice({
    name: "tasks",
    initialState: {} as TasksType,
    reducers: {
        deleteTask(state, action: PayloadAction<{ todolistId: string; taskId: string }>) {
            const index = state[action.payload.todolistId].findIndex((task) => task.id === action.payload.taskId)
            if (index !== -1) {
                state[action.payload.todolistId].splice(index, 1)
            }
        },
        addTask(state, action: PayloadAction<{ task: TaskDomainType }>) {
            state[action.payload.task.todoListId].unshift({ ...action.payload.task, entityStatus: "idle" })
        },
        updateTask(state, action: PayloadAction<{ todolistId: string; taskId: string; taskForUpdate: TaskType }>) {
            const index = state[action.payload.todolistId].findIndex((task) => task.id === action.payload.taskId)

            if (index !== -1) {
                state[action.payload.todolistId][index] = { ...action.payload.taskForUpdate }
            }
        },
        setTasks(state, action: PayloadAction<{ todolistId: string; tasks: TaskDomainType[] }>) {
            action.payload.tasks.forEach((task) => {
                state[action.payload.todolistId].push({ ...task, entityStatus: "idle" })
            })
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

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions

// Thunks
export const fetchTasksTC =
    (todolistId: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(appActions.setAppStatus({ status: "loading" }))
            const res = await todolistAPI.getTasks(todolistId)
            dispatch(tasksActions.setTasks({ todolistId, tasks: res.data.items }))
            dispatch(appActions.setAppStatus({ status: "completed" }))
        } catch (e: any) {
            handleServerNetworkError(dispatch, e)
        }
    }
export const deleteTaskTC =
    (todolistId: string, taskId: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(appActions.setAppStatus({ status: "loading" }))
            dispatch(tasksActions.setTaskEntityStatus({ todolistId, taskId, entityStatus: "loading" }))
            const res = await todolistAPI.deleteTask(todolistId, taskId)
            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(tasksActions.deleteTask({ todolistId, taskId }))
                dispatch(appActions.setAppStatus({ status: "completed" }))
            } else {
                handleServerAppError<{}>(dispatch, res.data)
            }
        } catch (e: any) {
            dispatch(tasksActions.setTaskEntityStatus({ todolistId, taskId, entityStatus: "idle" }))
            handleServerNetworkError(dispatch, e)
        }
    }
export const addTaskTC =
    (todolistId: string, title: string): AppThunk =>
    async (dispatch) => {
        try {
            dispatch(appActions.setAppStatus({ status: "loading" }))
            const res = await todolistAPI.createTask(todolistId, title)
            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(tasksActions.addTask({ task: res.data.data.item }))
                dispatch(appActions.setAppStatus({ status: "completed" }))
            } else {
                handleServerAppError<{ item: TaskDomainType }>(dispatch, res.data)
            }
        } catch (e) {
            handleServerNetworkError(dispatch, e as { message: string })
        }
    }
export const updateTaskTC =
    (todolistId: string, taskId: string, taskModelWithOnlyUpdatedProperties: UpdatedTaskDomainType): AppThunk =>
    async (dispatch, getState) => {
        try {
            dispatch(appActions.setAppStatus({ status: "loading" }))
            dispatch(tasksActions.setTaskEntityStatus({ todolistId, taskId, entityStatus: "loading" }))

            const taskFromRedux = getState().tasks[todolistId].find((t) => t.id === taskId)

            if (!taskFromRedux) {
                console.warn("task was not found")
                return
            }

            const taskForUpdate = {
                ...taskFromRedux,
                ...taskModelWithOnlyUpdatedProperties,
            }

            const res = await todolistAPI.updateTask(todolistId, taskId, taskForUpdate)

            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(appActions.setAppStatus({ status: "completed" }))
                dispatch(tasksActions.updateTask({ todolistId, taskId, taskForUpdate }))
                dispatch(tasksActions.setTaskEntityStatus({ todolistId, taskId, entityStatus: "completed" }))
            } else {
                handleServerAppError<{ item: TaskDomainType }>(dispatch, res.data)
            }
        } catch (e: any) {
            handleServerNetworkError(dispatch, e)
        }
    }

// types

export type TasksType = {
    [key: string]: TaskType[]
}

export type TaskType = TaskDomainType & {
    entityStatus: AppStatusesType
}

export type UpdatedTaskDomainType = {
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
