import { tasksActions, tasksReducer, tasksThunks, TasksType } from '../tasksSlice'
import { TaskPriorities, TaskStatuses } from 'common/enums'
import { todolistsActions } from '../todolistsSlice'

let todolistId1: string
let todolistId2: string
let startState: TasksType

beforeEach(() => {
    todolistId1 = '1'
    todolistId2 = '2'

    startState = {
        [todolistId1]: [
            {
                id: '1',
                title: 'HTML',
                status: TaskStatuses.Completed,
                todoListId: todolistId1,
                startDate: '',
                description: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: 'idle',
            },
            {
                id: '2',
                title: 'CSS',
                status: TaskStatuses.Completed,
                todoListId: todolistId1,
                startDate: '',
                description: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: 'idle',
            },
            {
                id: '3',
                title: 'JS',
                status: TaskStatuses.New,
                todoListId: todolistId1,
                startDate: '',
                description: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: 'idle',
            },
        ],
        [todolistId2]: [
            {
                id: '1',
                title: 'React',
                status: TaskStatuses.Completed,
                todoListId: todolistId2,
                startDate: '',
                description: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: 'idle',
            },
            {
                id: '2',
                title: 'Redux',
                status: TaskStatuses.Completed,
                todoListId: todolistId2,
                startDate: '',
                description: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: 'idle',
            },
            {
                id: '3',
                title: 'Next.js',
                status: TaskStatuses.New,
                todoListId: todolistId2,
                startDate: '',
                description: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: 'idle',
            },
        ],
    }
})

test('correct task status should be changed', () => {
    const action = tasksThunks.updateTask.fulfilled(
        {
            todolistId: todolistId1,
            taskId: '1',
            taskForUpdate: {
                id: '1',
                title: 'HTML',
                status: TaskStatuses.New,
                todoListId: todolistId1,
                startDate: '',
                description: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
            },
        },
        'request',
        {
            todolistId: todolistId1,
            taskId: '1',
            taskModelWithOnlyUpdatedProperties: { status: TaskStatuses.New },
        },
    )

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState[todolistId1][0].status).toBe(TaskStatuses.New)
})

test('correct task should be added to correct todolist', () => {
    const action = tasksThunks.addTask.fulfilled(
        {
            task: {
                addedDate: '',
                deadline: '',
                description: '',
                id: 'aks-232',
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                status: TaskStatuses.New,
                title: 'Jest',
                todoListId: '2',
            },
        },
        'request',
        { todolistId: '2', title: 'Jest' },
    )

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState[todolistId1].length).toBe(3)
    expect(endState[todolistId2].length).toBe(4)
    expect(endState[todolistId2][0].id).toBe('aks-232')
    expect(endState[todolistId2][0].title).toBe('Jest')
})

test('correct task should be removed from correct todolist', () => {
    const action = tasksActions.deleteTask({ todolistId: todolistId1, taskId: '2' })

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState[todolistId1].length).toBe(2)
    expect(endState[todolistId2].length).toBe(3)
    expect(endState[todolistId1][1].id).toBe('3')
})

test('correct title should be changed in correct task', () => {
    const action = tasksThunks.updateTask.fulfilled(
        {
            todolistId: todolistId2,
            taskId: '3',
            taskForUpdate: {
                id: '3',
                title: 'Nest.js',
                status: TaskStatuses.New,
                todoListId: todolistId2,
                startDate: '',
                description: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
            },
        },
        'request',
        {
            todolistId: todolistId2,
            taskId: '3',
            taskModelWithOnlyUpdatedProperties: { title: 'Nest.js' },
        },
    )

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState[todolistId2][2].title).toBe('Nest.js')
    expect(endState[todolistId1][2].title).toBe('JS')
})

test('correct array of tasks should be removed', () => {
    const action = todolistsActions.deleteTodolist({ todolistId: todolistId1 })

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState[todolistId2]).toBeDefined()
    expect(endState[todolistId2][2].title).toBe('Next.js')
    expect(endState[todolistId1]).not.toBeDefined()
})

test('new empty array of tasks should be added', () => {
    const action = todolistsActions.addTodolist({
        todolist: {
            id: '3',
            title: 'New todolist',
            addedDate: '',
            order: 0,
        },
    })

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState).toHaveProperty(action.payload.todolist.id, [])
})

test('when todolists was set, empty tasks should be added', () => {
    const action = todolistsActions.setTodolists({
        todolists: [
            { id: '1', title: 'title 1', order: 0, addedDate: '' },
            { id: '2', title: 'title 2', order: 0, addedDate: '' },
        ],
    })

    const endState: TasksType = tasksReducer({}, action)

    expect(endState['1']).toStrictEqual([])
    expect(endState['2']).toStrictEqual([])
})

test('correct entity status should be changed in correct task', () => {
    const action = tasksActions.setTaskEntityStatus({ todolistId: '1', taskId: '3', entityStatus: 'failed' })

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState['1'][2].entityStatus).toBe('failed')
    expect(endState['2'][2].entityStatus).toBe('idle')
})

test('tasks should be added to todolist', () => {
    const action = tasksThunks.fetchTasks.fulfilled({ todolistId: '1', tasks: startState[todolistId1] }, 'request', '1')

    const endState = tasksReducer(
        {
            '1': [],
            '2': [],
        },
        action,
    )

    expect(endState['1'].length).toBe(3)
    expect(endState['2'].length).toBe(0)
})
