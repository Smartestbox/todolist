import { AuthInitialState, authReducer, authThunks } from 'features/auth/model/authSlice'

let initialState: AuthInitialState

beforeEach(() => {
    initialState = {
        isLoggedIn: false,
    }
})

test('user should be logged in', () => {
    const action = authThunks.login.fulfilled({ isLoggedIn: true }, 'request', {
        loginData: {
            email: '',
            password: '',
            rememberMe: true,
        },
    })

    const endState = authReducer(initialState, action)

    expect(endState.isLoggedIn).toBe(true)
})
