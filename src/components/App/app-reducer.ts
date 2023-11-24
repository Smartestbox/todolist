
const initialState = {
    status: 'idle' as AppStatusesType,
    error: null as null | string
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType) => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {
                ...state,
                status: action.status
            }
        case 'APP/SET-ERROR':
            return {
                ...state,
                error: action.error
            }
        default:
            return state
    }
}

// Actions

export const setAppStatusAC = (status: AppStatusesType) => ({
    type: 'APP/SET-STATUS' as const,
    status
})

export const setAppErrorAC = (error: string | null) => ({
    type: 'APP/SET-ERROR' as const,
    error
})


// Types

export type AppActionsType = ReturnType<typeof setAppStatusAC> | ReturnType<typeof setAppErrorAC>

export type InitialStateType = typeof initialState

export type AppStatusesType = 'idle' | 'loading' | 'completed' | 'failed'