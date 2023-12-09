import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const slice = createSlice({
    name: "app",
    initialState: {
        isInitialized: false,
        status: "idle" as AppStatusesType,
        error: null as null | string,
    },
    reducers: {
        setAppStatus(state, action: PayloadAction<{ status: AppStatusesType }>) {
            state.status = action.payload.status
        },
        setAppError(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppIsInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        },
    },
})

export const appReducer = slice.reducer
export const appActions = slice.actions

// Types
export type AppInitialState = ReturnType<typeof slice.getInitialState>
export type AppStatusesType = "idle" | "loading" | "completed" | "failed"
