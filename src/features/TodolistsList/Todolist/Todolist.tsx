import React, { useEffect } from 'react'
import { tasksThunks } from 'features/TodolistsList/model/tasks/tasksSlice'
import { TodolistType } from 'features/TodolistsList/model/todolists/todolistsSlice'
import styles from './Todolist.module.css'
import { AppStatusesType } from 'app/model/appSlice'
import { useAppDispatch } from 'common/hooks/useAppDispatch'
import { AddItemForm } from 'common/components'
import FilterTasksButtons from 'features/TodolistsList/Todolist/FilterTasksButtons/FilterTasksButtons'
import { Tasks } from 'features/TodolistsList/Todolist/Tasks/Tasks'
import { Title } from 'features/TodolistsList/Todolist/Title/Title'

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
        dispatch(tasksThunks.addTask({ todolistId: id, title }))
    }

    const isDisabled = entityStatus === 'loading'

    return (
        <div className={styles.todolist}>
            <Title id={id} title={title} isDisabled={isDisabled} />

            <AddItemForm label="Add task" disabled={isDisabled} addItem={addTaskHandler} />

            <Tasks id={id} filter={filter} />

            <FilterTasksButtons id={id} filter={filter} />
        </div>
    )
}

export default Todolist
