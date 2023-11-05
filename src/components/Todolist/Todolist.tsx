import React, {memo, useCallback} from 'react';
import AddItemForm from "../AddItemForm/AddItemForm";
import {TaskType, TodolistType} from "../App/App";
import EditableSpan from "../EditableSpan/EditableSpan";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../state/store";
import {AddTaskAC} from "../../state/tasks-reducer";
import {ChangeTodolistFilterAC, ChangeTodolistTitleAC, RemoveTodolistAC} from "../../state/todolists-reducer";
import Task from "../Task/Task";
import {Button} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import styles from '../../styles/Todolist.module.css'


type TodolistPropsType = {
    todolist: TodolistType
}

const Todolist: React.FC<TodolistPropsType> = memo(({todolist}) => {
    const {id, title, filter} = todolist
    const tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[id])

    const dispatch = useDispatch()

    const addItemHandler = useCallback((value: string) => {
        dispatch(AddTaskAC(id, value))
    }, [dispatch])

    const onRemoveTodoHandler = () => {
        dispatch(RemoveTodolistAC(id))
    }

    const changeTodolistTitleHandler = useCallback((title: string) => {
        dispatch(ChangeTodolistTitleAC(id, title))
    }, [dispatch, id])

    const onAllFilterHandler = () => {
        dispatch(ChangeTodolistFilterAC(id, 'All'))
    }

    const onActiveFilterHandler = () => {
        dispatch(ChangeTodolistFilterAC(id, 'Active'))
    }

    const onCompletedFilterHandler = () => {
        dispatch(ChangeTodolistFilterAC(id, 'Completed'))
    }

    const tasksForTodo: TaskType[] = filter === 'All'
        ? tasks
        : filter === 'Completed'
            ? tasks.filter(t => t.isDone)
            : tasks.filter(t => !t.isDone)


    return (
        <div className={styles.todolist}>
            <EditableSpan title={title} changeItemTitle={changeTodolistTitleHandler}/>
            <IconButton onClick={onRemoveTodoHandler}>
                <DeleteIcon/>
            </IconButton>
            <AddItemForm label='Add task' addItem={addItemHandler}/>
            {
                tasksForTodo.map(t => {
                    return (
                        <Task
                            key={t.id}
                            todolistId={id}
                            task={t}
                        />
                    )
                })
            }
            <div>
                <Button variant='text' size='small' onClick={onAllFilterHandler}>All</Button>
                <Button variant='text' size='small' color='warning' onClick={onActiveFilterHandler}>Active</Button>
                <Button variant='text' size='small' color='success' onClick={onCompletedFilterHandler}>Completed</Button>
            </div>
        </div>
    );
})

export default Todolist;