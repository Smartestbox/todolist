import {TasksType} from "../components/App/App";
import {AddTaskAC, ChangeTaskStatusAC, ChangeTaskTitleAC, RemoveTaskAC, tasksReducer} from "./tasks-reducer";
import {AddTodolistAC, RemoveTodolistAC} from "./todolists-reducer";

let todolistId1: string
let todolistId2: string
let startState: TasksType

beforeEach(() => {

    todolistId1 = '1'
    todolistId2 = '2'

    startState = {
        [todolistId1]: [
            {id: '1', title: 'HTML', isDone: true},
            {id: '2', title: 'CSS', isDone: true},
            {id: '3', title: 'JS', isDone: false}
        ],
        [todolistId2]: [
            {id: '1', title: 'React', isDone: true},
            {id: '2', title: 'Redux', isDone: true},
            {id: '3', title: 'Next.js', isDone: false}
        ]
    }

})


test('correct task status should be changed', () => {

    const action = ChangeTaskStatusAC(todolistId1, '1', false)

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState[todolistId1][0].isDone).toBe(false)

})

test('correct task should be added to correct todolist', () => {

    const action = AddTaskAC(todolistId2, 'Jest')

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState[todolistId1].length).toBe(3)
    expect(endState[todolistId2].length).toBe(4)
    expect(endState[todolistId2][0].title).toBe('Jest')

})

test('correct task should be removed from correct todolist', () => {

    const action = RemoveTaskAC(todolistId1, '2')

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState[todolistId1].length).toBe(2)
    expect(endState[todolistId2].length).toBe(3)
    expect(endState[todolistId1][1].id).toBe('3')

})

test('correct title should be changed in correct task', () => {

    const action = ChangeTaskTitleAC(todolistId2, '3', 'Nest.js')

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState[todolistId2][2].title).toBe('Nest.js')
    expect(endState[todolistId1][2].title).toBe('JS')

})

test('correct array of tasks should be removed', () => {

    const action = RemoveTodolistAC(todolistId1)

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState[todolistId2]).toBeDefined()
    expect(endState[todolistId2][2].title).toBe('Next.js')
    expect(endState[todolistId1]).not.toBeDefined()

})

test('new empty array of tasks should be added', () => {

    const action = AddTodolistAC('new title')

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState).toHaveProperty(action.todolistId, [])

})