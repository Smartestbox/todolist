import {addTodolistAC, clearDataAC, deleteTodolistAC, setTodolistsAC} from "./todolists-reducer";
import {RESULT_CODE, TaskDomainType, TaskPriorities, TaskStatuses, todolistAPI} from "../../api/todolist-api";
import {AppThunk} from "../../components/App/store";
import {AppStatusesType, setAppStatusAC} from "../../components/App/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState: TasksType = {}

export const tasksReducer = (state: TasksType = initialState, action: TasksActionTypes): TasksType => {
    switch (action.type) {
        case 'TASKS/UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(task => task.id === action.taskId
                    ? action.task
                    : task)
            }
        case 'TASKS/ADD-TASK':
            return {
                ...state,
                [action.task.todoListId]: [
                    {...action.task, entityStatus: 'idle'},
                    ...state[action.task.todoListId]
                ]
            }
        case 'TASKS/DELETE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(task => task.id !== action.taskId)
            }
        case 'TASKS/SET-TASKS':
            return {
                ...state,
                [action.todolistId]: action.tasks.map(task => ({...task, entityStatus: 'idle'}))
            }
        case 'TASKS/SET-ENTITY-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(task => task.id === action.taskId
                    ? {...task, entityStatus: action.entityStatus}
                    : task)
            }
        case 'TODOLIST/DELETE-TODOLIST': {
            let newState = {...state}
            delete newState[action.todolistId]
            return newState
        }
        case 'TODOLIST/ADD-TODOLIST':
            return {
                ...state,
                [action.todolist.id]: []
            }
        case 'TODOLIST/SET-TODOLISTS': {
            let stateCopy = {...state}
            action.todolists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case 'CLEAR-DATA':
            return {}
        default:
            return state
    }
}

// Actions
export const updateTaskAC = (todolistId: string, taskId: string, updatedTaskModel: TaskType) =>
    ({type: 'TASKS/UPDATE-TASK', todolistId, taskId, task: updatedTaskModel}) as const
export const addTaskAC = (task: TaskDomainType) =>
    ({type: 'TASKS/ADD-TASK', task}) as const
export const deleteTaskAC = (todolistId: string, taskId: string) =>
    ({type: 'TASKS/DELETE-TASK', todolistId, taskId}) as const
export const setTasksAC = (todolistId: string, tasks: TaskDomainType[]) =>
    ({type: 'TASKS/SET-TASKS', todolistId, tasks}) as const
export const setTaskEntityStatusAC = (todolistId: string, taskId: string, entityStatus: AppStatusesType) =>
    ({type: 'TASKS/SET-ENTITY-STATUS', todolistId, taskId, entityStatus} as const)

// Thunks
export const fetchTasksTC = (todolistId: string): AppThunk =>
    async dispatch => {
        try {
            dispatch(setAppStatusAC('loading'))
            const res = await todolistAPI.getTasks(todolistId)
            dispatch(setTasksAC(todolistId, res.data.items))
            dispatch(setAppStatusAC('completed'))
        } catch (e: any) {
            handleServerNetworkError(dispatch, e)
        }
    }
export const deleteTaskTC = (todolistId: string, taskId: string): AppThunk =>
    async dispatch => {
        try {
            dispatch(setAppStatusAC('loading'))
            dispatch(setTaskEntityStatusAC(todolistId, taskId, 'loading'))
            const res = await todolistAPI.deleteTask(todolistId, taskId)
            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(deleteTaskAC(todolistId, taskId))
                dispatch(setAppStatusAC('completed'))
            } else {
                handleServerAppError<{}>(dispatch, res.data)
            }
        } catch (e: any) {
            dispatch(setTaskEntityStatusAC(todolistId, taskId, 'idle'))
            handleServerNetworkError(dispatch, e)
        }
    }
export const addTaskTC = (todolistId: string, title: string): AppThunk =>
    (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistAPI.createTask(todolistId, title)
            .then(res => {
                if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                    dispatch(addTaskAC(res.data.data.item))
                    dispatch(setAppStatusAC('completed'))
                } else {
                    handleServerAppError<{ item: TaskDomainType }>(dispatch, res.data)
                }
            })
            .catch(e => {
                handleServerNetworkError(dispatch, e)
            })
    }
export const updateTaskTC = (
    todolistId: string,
    taskId: string,
    taskModelWithOnlyUpdatedProperties: UpdatedTaskDomainType
): AppThunk =>
    async (dispatch, getState) => {
        try {
            dispatch(setAppStatusAC('loading'))
            dispatch(setTaskEntityStatusAC(todolistId, taskId, 'loading'))
            const taskFromRedux = getState()
                .tasks[todolistId]
                .find(t => t.id === taskId)

            if (!taskFromRedux) {
                console.warn('task was not found')
                return
            }

            const taskForUpdate = {
                ...taskFromRedux,
                ...taskModelWithOnlyUpdatedProperties
            }

            const res = await todolistAPI.updateTask(todolistId, taskId, taskForUpdate)

            if (res.data.resultCode === RESULT_CODE.SUCCEEDED) {
                dispatch(updateTaskAC(todolistId, taskId, taskForUpdate))
                dispatch(setTaskEntityStatusAC(todolistId, taskId, 'completed'))
            } else {
                handleServerAppError<{ item: TaskDomainType }>(dispatch, res.data)
            }
        } catch (e: any) {
            handleServerNetworkError(dispatch, e)
        }
    }

// types
export type TasksActionTypes =
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof deleteTaskAC>
    | ReturnType<typeof deleteTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof setTaskEntityStatusAC>
    | ReturnType<typeof clearDataAC>

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

