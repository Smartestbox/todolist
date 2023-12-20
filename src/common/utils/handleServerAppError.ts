import { AppDispatchType } from 'app/store'
import { appActions } from 'app/model/appSlice'
import { BaseResponseType } from 'common/types/BaseResponseType'

export const handleServerAppError = <D>(
    dispatch: AppDispatchType,
    data: BaseResponseType<D>,
    showGlobalError = true,
) => {
    if (showGlobalError) {
        dispatch(
            appActions.setAppError({ error: data.messages.length ? data.messages[0] : 'unknown error has occurred' }),
        )
    }

    dispatch(appActions.setAppStatus({ status: 'failed' }))
}
