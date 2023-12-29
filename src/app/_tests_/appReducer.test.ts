import { appActions, AppInitialState, appReducer } from 'app/model/appSlice'

let initialState: AppInitialState

beforeEach(() => {
    initialState = {
        isInitialized: false,
        status: 'idle',
        error: null,
    }
})

test('error should be changed', () => {
    const action = appActions.setAppError({ error: 'some error' })

    const endState = appReducer(initialState, action)

    expect(endState.error).toBe('some error')
})

test('isInitialized value should be changed', () => {
    const action = appActions.setAppIsInitialized({ isInitialized: true })

    const endState = appReducer(initialState, action)

    expect(endState.isInitialized).toBe(true)
})
