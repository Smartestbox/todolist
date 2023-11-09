import React, {ChangeEvent, memo} from 'react';
import styles from "../../styles/App.module.css";
import EditableSpan from "../EditableSpan/EditableSpan";
import {ChangeTaskStatusAC, ChangeTaskTitleAC, deleteTaskTC, RemoveTaskAC} from "../../state/tasks-reducer";
import {Checkbox} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {TaskDomainType, TaskStatuses} from "../../api/todolist-api";
import {useAppDispatch} from "../../state/store";

type TaskPropsType = {
    todolistId: string
    task: TaskDomainType
}

const Task: React.FC<TaskPropsType> = memo(({todolistId, task}) => {
    const dispatch = useAppDispatch()
    const removeTaskHandler = () => {
        dispatch(deleteTaskTC(todolistId, task.id))
    }
    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const taskStatus = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(ChangeTaskStatusAC(todolistId, task.id, taskStatus))
    }
    const changeTaskTitleHandler = (taskTitle: string) => {
        dispatch(ChangeTaskTitleAC(todolistId, task.id, taskTitle))
    }

    return (
        <li className={styles.task}>
            <Checkbox
                checked={task.status === TaskStatuses.Completed}
                onChange={changeTaskStatusHandler}
            />
            <EditableSpan title={task.title} changeItemTitle={changeTaskTitleHandler}/>
            <IconButton onClick={removeTaskHandler}>
                <DeleteIcon />
            </IconButton>
        </li>
    );
})

export default Task;