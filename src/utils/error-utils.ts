import { ResponseType } from '../api/todolist-api'
import { appActions } from '../components/App/app-reducer'
import { AppDispatchType } from '../components/App/store'
import axios from 'axios'

export const handleServerAppError = <D>(dispatch: AppDispatchType, data: ResponseType<D>) => {
    if (data.messages.length) {
        dispatch(appActions.setAppError({ error: data.messages[0] }))
    } else {
        dispatch(appActions.setAppError({ error: 'unknown error has occurred' }))
    }
    dispatch(appActions.setAppStatus({ status: 'failed' }))
}

export const handleServerNetworkError = (dispatch: AppDispatchType, error: unknown): void => {
    let errorMessage = 'Some error occurred'

    if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error?.message || errorMessage
    } else if (error instanceof Error) {
        errorMessage = `Native error: ${error.message}`
    } else {
        errorMessage = JSON.stringify(error)
    }

    dispatch(appActions.setAppError({ error: errorMessage }))
    dispatch(appActions.setAppStatus({ status: 'failed' }))
}

// type ErrorUtilsDispatch = Dispatch<ReturnType<typeof setAppStatusAC> | ReturnType<typeof setAppErrorAC>>
