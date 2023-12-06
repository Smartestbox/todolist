import {appReducer, InitialStateType, setAppErrorAC, setAppIsInitializedAC, setAppStatusAC} from "./app-reducer"

let initialState: InitialStateType

beforeEach(() => {
    initialState = {
        isInitialized: false,
        status: "idle",
        error: null
    }
})

test('status should be changed', () => {
    const action = setAppStatusAC('completed')

    const endState = appReducer(initialState, action)

    expect(endState.status).toBe('completed')
})

test('error should be changed', () => {
    const action = setAppErrorAC('some error')

    const endState = appReducer(initialState, action)

    expect(endState.error).toBe('some error')
})

test('isInitialized value should be changed', () => {
    const action = setAppIsInitializedAC(true)

    const endState = appReducer(initialState, action)

    expect(endState.isInitialized).toBe(true)
})