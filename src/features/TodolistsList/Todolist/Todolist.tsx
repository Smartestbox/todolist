import React, { useEffect } from 'react'
import { tasksThunks } from 'features/TodolistsList/model/tasks/tasksSlice'
import { todolistsThunks, TodolistType } from 'features/TodolistsList/model/todolists/todolistsSlice'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import styles from './Todolist.module.css'
import { AppStatusesType } from 'app/model/appSlice'
import { useAppDispatch } from 'common/hooks/useAppDispatch'
import { AddItemForm, EditableSpan } from 'common/components'
import FilterTasksButtons from 'features/TodolistsList/Todolist/FilterTasksButtons/FilterTasksButtons'
import { Tasks } from 'features/TodolistsList/Todolist/Tasks/Tasks'

type Props = {
    todolist: TodolistType
    entityStatus: AppStatusesType
}

const Todolist = ({ todolist, entityStatus }: Props) => {
    const { id, title, filter } = todolist

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(tasksThunks.fetchTasks(id))
    }, [id])

    const addTaskHandler = (title: string) => {
        return dispatch(tasksThunks.addTask({ todolistId: id, title })).unwrap()
    }
    const removeTodolistHandler = () => {
        dispatch(todolistsThunks.deleteTodolist({ todolistId: id }))
    }

    const changeTodolistTitleHandler = (title: string) => {
        dispatch(todolistsThunks.changeTodolistTitle({ todolistId: id, title }))
    }

    const isDisabled = entityStatus === 'loading'

    return (
        <div className={styles.todolist}>
            <EditableSpan title={title} changeItemTitle={changeTodolistTitleHandler} />

            <IconButton onClick={removeTodolistHandler} disabled={isDisabled}>
                <DeleteIcon />
            </IconButton>

            <AddItemForm label="Add task" disabled={isDisabled} addItem={addTaskHandler} />

            <Tasks id={id} filter={filter} />

            <FilterTasksButtons id={id} filter={filter} />
        </div>
    )
}

export default Todolist
