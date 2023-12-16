import { todolistsActions, todolistsReducer, todolistsThunks, TodolistType } from '../todolistsSlice'
import { tasksReducer, TasksType } from '../tasksSlice'

test('ids should be equals', () => {
    const startTasksState: TasksType = {}
    const startTodolistsState: TodolistType[] = []

    const action = todolistsThunks.createTodolist.fulfilled(
        {
            todolist: {
                id: '3',
                title: 'New todolist',
                addedDate: '',
                order: 0,
            },
        },
        'request',
        { title: 'New todolist' },
    )

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolist.id)
    expect(idFromTodolists).toBe(action.payload.todolist.id)
})
