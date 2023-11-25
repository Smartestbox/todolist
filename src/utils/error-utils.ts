import {setAppErrorAC, setAppStatusAC} from "../components/App/app-reducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolist-api";


export const handleServerAppError = <D>(dispatch: ErrorUtilsDispatch, data: ResponseType<D>) => {
        if (data.messages.length) {
            dispatch(setAppErrorAC(data.messages[0]))
        } else {
            dispatch(setAppErrorAC('unknown error has occurred'))
        }
        dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (dispatch: ErrorUtilsDispatch, e: { message: string }) => {
    dispatch(setAppStatusAC('failed'))
    dispatch(setAppErrorAC(e.message))
}

type ErrorUtilsDispatch = Dispatch<
    | ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppErrorAC>
>