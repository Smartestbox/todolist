import { authActions, AuthInitialState, authReducer } from './auth-reducer'

let initialState: AuthInitialState

beforeEach(() => {
    initialState = {
        isLoggedIn: false,
    }
})

test('user should be logged in', () => {
    const action = authActions.setIsLoggedIn({ isLoggedIn: true })

    const endState = authReducer(initialState, action)

    expect(endState.isLoggedIn).toBe(true)
})
