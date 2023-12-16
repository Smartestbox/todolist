import { AppDispatchType } from '../../app/store'
import { ResponseType } from '../../api/todolist-api'
import { appActions } from '../../app/app-reducer'

export const handleServerAppError = <D>(dispatch: AppDispatchType, data: ResponseType<D>) => {
    if (data.messages.length) {
        dispatch(appActions.setAppError({ error: data.messages[0] }))
    } else {
        dispatch(appActions.setAppError({ error: 'unknown error has occurred' }))
    }
    dispatch(appActions.setAppStatus({ status: 'failed' }))
}
