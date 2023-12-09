import React, { ChangeEvent, memo } from "react"
import styles from "../../../components/App/App.module.css"
import EditableSpan from "../../../components/EditableSpan/EditableSpan"
import { deleteTaskTC, updateTaskTC } from "../tasks-reducer"
import { Checkbox } from "@mui/material"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import { TaskDomainType, TaskStatuses } from "../../../api/todolist-api"
import { useAppDispatch } from "../../../components/App/store"
import { AppStatusesType } from "../../../components/App/app-reducer"

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
        const taskStatus = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTaskTC(todolistId, task.id, { status: taskStatus }))
    }
    const changeTaskTitleHandler = (taskTitle: string) => {
        dispatch(updateTaskTC(todolistId, task.id, { title: taskTitle }))
    }

    const isDisabled = entityStatus === "loading"

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
