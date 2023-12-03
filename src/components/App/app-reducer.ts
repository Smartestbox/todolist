const initialState = {
    isInitialized: false,
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
        case 'APP/SET-IS-INITIALIZED':
            return {
                ...state,
                isInitialized: action.isInitialized
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

export const setAppIsInitializedAC = (isInitialized: boolean) => ({
    type: 'APP/SET-IS-INITIALIZED' as const,
    isInitialized
})


// Types

export type AppActionsType =
    | ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppErrorAC>
    | ReturnType<typeof setAppIsInitializedAC>

export type InitialStateType = typeof initialState

export type AppStatusesType = 'idle' | 'loading' | 'completed' | 'failed'