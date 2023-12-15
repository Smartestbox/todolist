import React, { memo, useCallback } from 'react'
import AddItemForm from '../../../components/AddItemForm/AddItemForm'
import EditableSpan from '../../../components/EditableSpan/EditableSpan'
import { useAppDispatch, useAppSelector } from '../../../components/App/store'
import { tasksThunks, TaskType } from '../tasks-reducer'
import { deleteTodolistTC, TodolistType, changeTodolistTitleTC, todolistsActions } from '../todolists-reducer'
import Task from '../Task/Task'
import { Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import styles from './Todolist.module.css'
import { TaskStatuses } from '../../../api/todolist-api'
import { AppStatusesType } from '../../../components/App/app-reducer'
import { selectTasks } from '../tasks-selectors'

type TodolistPropsType = {
    todolist: TodolistType
    entityStatus: AppStatusesType
}

const Todolist: React.FC<TodolistPropsType> = memo(({ todolist, entityStatus }) => {
    const { id, title, filter } = todolist
    const tasks = useAppSelector(selectTasks(id))

    const dispatch = useAppDispatch()

    const addItemHandler = useCallback(
        (title: string) => {
            dispatch(tasksThunks.addTask({ todolistId: id, title }))
        },
        [dispatch],
    )

    const onRemoveTodoHandler = () => {
        dispatch(deleteTodolistTC(id))
    }

    const changeTodolistTitleHandler = useCallback(
        (title: string) => {
            dispatch(changeTodolistTitleTC(id, title))
        },
        [dispatch, id],
    )

    const onAllFilterHandler = () => {
        dispatch(todolistsActions.changeTodolistFilter({ id, filter: 'All' }))
    }

    const onActiveFilterHandler = () => {
        dispatch(todolistsActions.changeTodolistFilter({ id, filter: 'Active' }))
    }

    const onCompletedFilterHandler = () => {
        dispatch(todolistsActions.changeTodolistFilter({ id, filter: 'Completed' }))
    }

    const tasksForTodo: TaskType[] =
        filter === 'All'
            ? tasks
            : filter === 'Completed'
              ? tasks.filter((t) => t.status === TaskStatuses.Completed)
              : tasks.filter((t) => t.status === TaskStatuses.New)

    const isDisabled = entityStatus === 'loading'

    return (
        <div className={styles.todolist}>
            <EditableSpan title={title} changeItemTitle={changeTodolistTitleHandler} />
            <IconButton onClick={onRemoveTodoHandler} disabled={isDisabled}>
                <DeleteIcon />
            </IconButton>
            <AddItemForm label="Add task" disabled={isDisabled} addItem={addItemHandler} />
            {tasksForTodo.map((t) => {
                return <Task key={t.id} todolistId={id} task={t} entityStatus={t.entityStatus} />
            })}
            <div>
                <Button variant={filter === 'All' ? 'contained' : 'text'} size="small" onClick={onAllFilterHandler}>
                    All
                </Button>
                <Button
                    variant={filter === 'Active' ? 'contained' : 'text'}
                    size="small"
                    color="warning"
                    onClick={onActiveFilterHandler}
                >
                    Active
                </Button>
                <Button
                    variant={filter === 'Completed' ? 'contained' : 'text'}
                    size="small"
                    color="success"
                    onClick={onCompletedFilterHandler}
                >
                    Completed
                </Button>
            </div>
        </div>
    )
})

export default Todolist
