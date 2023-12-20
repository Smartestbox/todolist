import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { AppDispatchType, RootStateType } from 'app/store'
import { BaseResponseType } from 'common/types/BaseResponseType'
import { appActions } from 'app/model/appSlice'
import { handleServerNetworkError } from 'common/utils/handleServerNetworkError'

export const thunkTryCatch = async <T>(
    thunkAPI: BaseThunkAPI<RootStateType, unknown, AppDispatchType, null | BaseResponseType>,
    logic: () => Promise<T>,
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    try {
        return await logic()
    } catch (e) {
        handleServerNetworkError(dispatch, e)
        return rejectWithValue(null)
    } finally {
        dispatch(appActions.setAppStatus({ status: 'idle' }))
    }
}
