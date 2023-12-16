import React, { ChangeEvent, memo } from 'react'
import styles from '../../../app/App.module.css'
import { deleteTaskTC, tasksThunks } from '../tasksSlice'
import { Checkbox } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { AppStatusesType } from 'app/appSlice'
import { useAppDispatch } from 'common/hooks/useAppDispatch'
import { EditableSpan } from 'common/components'
import { TaskStatuses } from 'common/enums'
import { TaskDomainType } from 'features/TodolistsList/api/todolistsList.api.types'

type TaskPropsType = {
    todolistId: string
    task: TaskDomainType
    entityStatus: AppStatusesType
}

const Task: React.FC<TaskPropsType> = memo(({ todolistId, task, entityStatus }) => {
    const dispatch = useAppDispatch()
    const removeTaskHandler = () => {
        dispatch(deleteTaskTC(todolistId, task.id))
    }
    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value.length < 101) {
            const taskStatus = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
            dispatch(
                tasksThunks.updateTask({
                    todolistId,
                    taskId: task.id,
                    taskModelWithOnlyUpdatedProperties: { status: taskStatus },
                }),
            )
        }
    }
    const changeTaskTitleHandler = (taskTitle: string) => {
        dispatch(
            tasksThunks.updateTask({
                todolistId,
                taskId: task.id,
                taskModelWithOnlyUpdatedProperties: { title: taskTitle },
            }),
        )
    }

    const isDisabled = entityStatus === 'loading'

    return (
        <li className={styles.task}>
            <Checkbox
                checked={task.status === TaskStatuses.Completed}
                onChange={changeTaskStatusHandler}
                disabled={isDisabled}
            />
            <EditableSpan title={task.title} changeItemTitle={changeTaskTitleHandler} />
            <IconButton onClick={removeTaskHandler} disabled={isDisabled}>
                <DeleteIcon />
            </IconButton>
        </li>
    )
})

export default Task
