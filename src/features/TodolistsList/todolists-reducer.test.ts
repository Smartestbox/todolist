import {v1} from "uuid";
import {
    TodolistsActionTypes,
    addTodolistAC, changeTodolistFilterAC,
    changeTodolistTitleAC,
    deleteTodolistAC,
    todolistsReducer, TodolistType, setTodolistsAC
} from "./todolists-reducer";

let todolistId1: string
let todolistId2: string

let startState: TodolistType[]

beforeEach(() => {

    todolistId1 = v1()
    todolistId2 = v1()

    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'All', entityStatus: 'idle', addedDate: '', order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'All', entityStatus: 'idle', addedDate: '', order: 0}
    ]

})

test('correct todolist should be removed', () => {

    const action: TodolistsActionTypes = deleteTodolistAC(todolistId1)

    const endState: TodolistType[] = todolistsReducer(startState, action)

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)

})

test('correct todolist should be added', () => {

    const action = addTodolistAC({
        id: '3',
        title: 'New todolist',
        addedDate: '',
        order: 0
    })

    const endState: TodolistType[] = todolistsReducer(startState, action)

    expect(endState.length).toBe(3)
    expect(endState[0].id).toBe('3')
    expect(endState[0].title).toBe('New todolist')

})

test('correct title of todolist should be changed', () => {

    const action: TodolistsActionTypes = changeTodolistTitleAC(todolistId1, 'New title')

    const endState: TodolistType[] = todolistsReducer(startState, action)

    expect(endState[0].title).toBe('New title')
    expect(endState[1].title).toBe('What to buy')

})

test('correct filter of todolist should be changed', () => {

    const action: TodolistsActionTypes = changeTodolistFilterAC(todolistId2, 'Completed')

    const endState: TodolistType[] = todolistsReducer(startState, action)

    expect(endState[0].filter).toBe('All')
    expect(endState[1].filter).toBe('Completed')

})

test('todolists should be set to the state', () => {

    const action: TodolistsActionTypes = setTodolistsAC(startState)

    const endState: TodolistType[] = todolistsReducer([], action)

    expect(endState.length).toBe(2)

})