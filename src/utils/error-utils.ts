import { Dispatch } from "redux"
import { ResponseType } from "../api/todolist-api"
import { appActions } from "../components/App/app-reducer"

export const handleServerAppError = <D>(dispatch: Dispatch, data: ResponseType<D>) => {
    if (data.messages.length) {
        dispatch(appActions.setAppError({ error: data.messages[0] }))
    } else {
        dispatch(appActions.setAppError({ error: "unknown error has occurred" }))
    }
    dispatch(appActions.setAppStatus({ status: "failed" }))
}

export const handleServerNetworkError = (dispatch: Dispatch, e: { message: string }) => {
    dispatch(appActions.setAppStatus({ status: "failed" }))
    dispatch(appActions.setAppError({ error: e.message }))
}

// type ErrorUtilsDispatch = Dispatch<ReturnType<typeof setAppStatusAC> | ReturnType<typeof setAppErrorAC>>
