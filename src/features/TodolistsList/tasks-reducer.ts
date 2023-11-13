import {AddTodolistAC, RemoveTodolistAC, SetTodolistsAC} from "./todolists-reducer";
import {TaskDomainType, TaskPriorities, TaskStatuses, todolistAPI} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../components/App/store";

const initialState: TasksType = {}

export const tasksReducer = (state: TasksType = initialState, action: TasksActionTypes): TasksType => {
    switch (action.type) {
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(task => task.id === action.taskId
                    ? action.task
                    : task)
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.task.todoListId]: [
                    action.task,
                    ...state[action.task.todoListId]
                ]
            }
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(task => task.id !== action.taskId)
            }
        // case 'CHANGE-TASK-TITLE':
        //     return {
        //         ...state,
        //         [action.todolistId]: state[action.todolistId].map(task => task.id === action.taskId
        //             ? {...task, title: action.title}
        //             : task)
        //     }
        case 'REMOVE-TODOLIST': {
            let newState = {...state}
            delete newState[action.todolistId]
            return newState
        }
        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.todolist.id]: []
            }
        case 'SET-TODOLISTS': {
            let stateCopy = {...state}
            action.todolists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case 'SET-TASKS': {
            return {...state, [action.todolistId]: action.tasks}
        }
        default:
            return state
    }
}

// actions
export const UpdateTaskAC = (todolistId: string, taskId: string, updatedTaskModel: TaskDomainType) =>
    ({type: 'UPDATE-TASK', todolistId, taskId, task: updatedTaskModel}) as const
export const AddTaskAC = (task: TaskDomainType) =>
    ({type: 'ADD-TASK', task}) as const
export const RemoveTaskAC = (todolistId: string, taskId: string) =>
    ({type: 'REMOVE-TASK', todolistId, taskId}) as const
export const SetTasksAC = (todolistId: string, tasks: TaskDomainType[]) =>
    ({type: 'SET-TASKS', todolistId, tasks}) as const

// thunks
export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        todolistAPI.getTasks(todolistId)
            .then(res => {
                dispatch(SetTasksAC(todolistId, res.data.items))
            })
    }
}
export const deleteTaskTC = (todolistId: string, taskId: string) =>
    (dispatch: Dispatch) => {
        todolistAPI.deleteTask(todolistId, taskId)
            .then(() => {
                dispatch(RemoveTaskAC(todolistId, taskId))
            })
    }
export const addTaskTC = (todolistId: string, title: string) =>
    (dispatch: Dispatch) => {
        todolistAPI.createTask(todolistId, title)
            .then(res => {
                dispatch(AddTaskAC(res.data.data.item))
            })
    }
export const updateTaskTC = (todolistId: string, taskId: string, taskModelWithOnlyUpdatedProperties: UpdatedTaskDomainType) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const taskFromRedux = getState().tasks[todolistId].find(t => t.id === taskId)

        if (!taskFromRedux) {
            console.warn('task was not found')
            return
        }

        const taskForUpdate = {
            ...taskFromRedux,
            ...taskModelWithOnlyUpdatedProperties
        }

        todolistAPI.updateTask(todolistId, taskId, taskForUpdate)
            .then(res => {
                dispatch(UpdateTaskAC(todolistId, taskId, taskForUpdate))
            })
    }

// types
type TasksActionTypes =
    | ReturnType<typeof AddTaskAC>
    | ReturnType<typeof RemoveTaskAC>
    | ReturnType<typeof RemoveTodolistAC>
    | ReturnType<typeof AddTodolistAC>
    | ReturnType<typeof SetTodolistsAC>
    | ReturnType<typeof SetTasksAC>
    | ReturnType<typeof UpdateTaskAC>
export type TasksType = {
    [key: string]: TaskDomainType[]
}
export type UpdatedTaskDomainType = {
    id?: string
    title?: string
    description?: string
    todoListId?: string
    order?: number
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: ''
    deadline?: ''
    addedDate?: ''
}