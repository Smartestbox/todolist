import React from 'react'
import Task from 'features/TodolistsList/Todolist/Tasks/Task/Task'
import { TaskType } from 'features/TodolistsList/model/tasks/tasksSlice'
import { TaskStatuses } from 'common/enums'
import { useAppSelector } from 'common/hooks'
import { selectTasks } from 'features/TodolistsList/model/tasks/tasksSelectors'
import { TasksFiltersType } from 'features/TodolistsList/model/todolists/todolistsSlice'

type Props = {
    id: string
    filter: TasksFiltersType
}

export const Tasks = ({ id, filter }: Props) => {
    const tasks = useAppSelector(selectTasks(id))

    const tasksForTodo: TaskType[] =
        filter === 'All'
            ? tasks
            : filter === 'Completed'
              ? tasks.filter((t) => t.status === TaskStatuses.Completed)
              : tasks.filter((t) => t.status === TaskStatuses.New)

    return (
        <div>
            {tasksForTodo.map((t) => {
                return <Task key={t.id} todolistId={id} task={t} entityStatus={t.entityStatus} />
            })}
        </div>
    )
}
