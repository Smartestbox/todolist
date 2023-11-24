import {addTaskAC, deleteTaskAC, setTaskEntityStatusAC, tasksReducer, TasksType, updateTaskAC} from "./tasks-reducer";
import {addTodolistAC, deleteTodolistAC, setTodolistsAC} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../../api/todolist-api";

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
                entityStatus: 'idle'
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
                entityStatus: 'idle'
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
                entityStatus: 'idle'
            }
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
                entityStatus: 'idle'
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
                entityStatus: 'idle'
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
                entityStatus: 'idle'
            }
        ]
    }
})

test('correct task status should be changed', () => {

    const action = updateTaskAC(todolistId1, '1', {
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
        entityStatus: 'idle'
    })

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState[todolistId1][0].status).toBe(TaskStatuses.New)

})

test('correct task should be added to correct todolist', () => {

    const action = addTaskAC({
        addedDate: "",
        deadline: "",
        description: "",
        id: "aks-232",
        order: 0,
        priority: TaskPriorities.Low,
        startDate: "",
        status: TaskStatuses.New,
        title: "Jest",
        todoListId: "2"
    })

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState[todolistId1].length).toBe(3)
    expect(endState[todolistId2].length).toBe(4)
    expect(endState[todolistId2][0].id).toBe("aks-232")
    expect(endState[todolistId2][0].title).toBe('Jest')

})

test('correct task should be removed from correct todolist', () => {

    const action = deleteTaskAC(todolistId1, '2')

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState[todolistId1].length).toBe(2)
    expect(endState[todolistId2].length).toBe(3)
    expect(endState[todolistId1][1].id).toBe('3')

})

test('correct title should be changed in correct task', () => {

    const action = updateTaskAC(todolistId2, '3', {
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
        entityStatus: 'idle'
    })

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState[todolistId2][2].title).toBe('Nest.js')
    expect(endState[todolistId1][2].title).toBe('JS')

})

test('correct array of tasks should be removed', () => {

    const action = deleteTodolistAC(todolistId1)

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState[todolistId2]).toBeDefined()
    expect(endState[todolistId2][2].title).toBe('Next.js')
    expect(endState[todolistId1]).not.toBeDefined()

})

test('new empty array of tasks should be added', () => {

    const action = addTodolistAC({
        id: '3' ,
        title: 'New todolist',
        addedDate: '',
        order: 0,
    })

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState).toHaveProperty(action.todolist.id, [])

})

test('when todolists was set, tasks with empty arrays should be added', () => {
    const action = setTodolistsAC([
        {id: '1', title: 'title 1', order: 0, addedDate: ''},
        {id: '2', title: 'title 2', order: 0, addedDate: ''}
    ])

    const endState: TasksType = tasksReducer({}, action)

    expect(endState['1']).toStrictEqual([])
    expect(endState['2']).toStrictEqual([])
})

test('correct entity status should be changed in correct task', () => {
    const action = setTaskEntityStatusAC('1', '3', 'failed')

    const endState: TasksType = tasksReducer(startState, action)

    expect(endState['1'][2].entityStatus).toBe('failed')
    expect(endState['2'][2].entityStatus).toBe('idle')
})