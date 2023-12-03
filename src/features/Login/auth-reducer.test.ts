import {authReducer, InitialStateType, setIsLoggedInAC} from "./auth-reducer";

let initialState: InitialStateType;

beforeEach(() => {
    initialState = {
        isLoggedIn: false
    }
})

test('user should be logged in', () => {
    const action = setIsLoggedInAC(true)

    const endState = authReducer(initialState, action)

    expect(endState.isLoggedIn).toBe(true)
})