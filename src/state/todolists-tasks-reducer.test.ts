import {AddTodolistAC, todolistsReducer, TodolistType} from "./todolists-reducer";
import {tasksReducer} from "./tasks-reducer";
import {TasksType} from "./tasks-reducer.test";

test('ids should be equals', () => {

    const startTasksState: TasksType = {}
    const startTodolistsState: TodolistType[] = []

    const action = AddTodolistAC('new todolist')

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.todolistId)
    expect(idFromTodolists).toBe(action.todolistId)

})