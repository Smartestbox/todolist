import { AppDispatchType } from 'app/store'
import { appActions } from 'app/appSlice'
import { ResponseType } from 'common/types/responseType'

export const handleServerAppError = <D>(dispatch: AppDispatchType, data: ResponseType<D>) => {
    if (data.messages.length) {
        dispatch(appActions.setAppError({ error: data.messages[0] }))
    } else {
        dispatch(appActions.setAppError({ error: 'unknown error has occurred' }))
    }
    dispatch(appActions.setAppStatus({ status: 'failed' }))
}
