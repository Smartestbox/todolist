import React, {ChangeEvent, memo} from 'react';
import styles from "../../Styles/App.module.css";
import EditableSpan from "../EditableSpan/EditableSpan";
import {TaskType} from "../App/App";
import {useDispatch} from "react-redux";
import {ChangeTaskStatusAC, ChangeTaskTitleAC, RemoveTaskAC} from "../../state/tasks-reducer";
import {Checkbox} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';


type TaskPropsType = {
    todolistId: string
    task: TaskType
}

const Task: React.FC<TaskPropsType> = memo(({todolistId, task}) => {
    const dispatch = useDispatch()
    const removeTaskHandler = () => {
        dispatch(RemoveTaskAC(todolistId, task.id))
    }
    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(ChangeTaskStatusAC(todolistId, task.id, e.currentTarget.checked))
    }
    const changeTaskTitleHandler = (taskTitle: string) => {
        dispatch(ChangeTaskTitleAC(todolistId, task.id, taskTitle))
    }

    return (
        <li className={styles.task}>
            <Checkbox
                checked={task.isDone}
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