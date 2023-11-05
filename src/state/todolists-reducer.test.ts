import {v1} from "uuid";
import {
    TodolistsActionTypes,
    AddTodolistAC, ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC,
    todolistsReducer
} from "./todolists-reducer";
import {TodolistType} from "../Components/App/App";

let todolistId1: string
let todolistId2: string

let startState: TodolistType[]

beforeEach(() => {

    todolistId1 = v1()
    todolistId2 = v1()

    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'All'},
        {id: todolistId2, title: 'What to buy', filter: 'All'}
    ]

})

test('correct todolist should be removed', () => {

    const action: TodolistsActionTypes = RemoveTodolistAC(todolistId1)

    const endState: TodolistType[] = todolistsReducer(startState, action)

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)

})

test('correct todolist should be added', () => {

    const action: TodolistsActionTypes = AddTodolistAC('New todolist')

    const endState: TodolistType[] = todolistsReducer(startState, action)

    expect(endState.length).toBe(3)
    expect(endState[2].id).toBe(action.todolistId)
    expect(endState[2].title).toBe('New todolist')

})

test('correct title of todolist should be changed', () => {

    const action: TodolistsActionTypes = ChangeTodolistTitleAC(todolistId1, 'New title')

    const endState: TodolistType[] = todolistsReducer(startState, action)

    expect(endState[0].title).toBe('New title')
    expect(endState[1].title).toBe('What to buy')

})

test('correct filter of todolist should be changed', () => {

    const action: TodolistsActionTypes = ChangeTodolistFilterAC(todolistId2, 'Completed')

    const endState: TodolistType[] = todolistsReducer(startState, action)

    expect(endState[0].filter).toBe('All')
    expect(endState[1].filter).toBe('Completed')

})