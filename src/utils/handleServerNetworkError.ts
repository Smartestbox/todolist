import { appActions } from '../components/App/app-reducer'
import { AppDispatchType } from '../components/App/store'
import axios from 'axios'

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
