import { AnyAction, createSlice, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit'
import { todolistsThunks } from 'features/TodolistsList/model/todolists/todolistsSlice'
import { tasksThunks } from 'features/TodolistsList/model/tasks/tasksSlice'

const slice = createSlice({
    name: 'app',
    initialState: {
        isInitialized: false,
        status: 'idle' as AppStatusesType,
        error: null as null | string,
    },
    reducers: {
        setAppError(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppIsInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(isPending, (state) => {
                state.status = 'loading'
            })
            .addMatcher(isFulfilled, (state) => {
                state.status = 'completed'
            })
            .addMatcher(isRejected, (state, action: AnyAction) => {
                state.status = 'failed'

                if (
                    action.type === todolistsThunks.createTodolist.rejected.type ||
                    action.type === tasksThunks.addTask.rejected.type
                ) {
                    return
                }

                if (action.payload) {
                    state.error = action.payload.messages[0]
                } else {
                    state.error = action.error.message ? action.error.message : 'Some unknown error has occurred'
                }
            })
    },
})

export const appReducer = slice.reducer
export const appActions = slice.actions

// Types
export type AppInitialState = ReturnType<typeof slice.getInitialState>
export type AppStatusesType = 'idle' | 'loading' | 'completed' | 'failed'
