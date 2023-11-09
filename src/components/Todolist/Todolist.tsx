import React, {memo, useCallback, useEffect} from 'react';
import AddItemForm from "../AddItemForm/AddItemForm";
import EditableSpan from "../EditableSpan/EditableSpan";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../../state/store";
import {AddTaskAC, addTaskTC, fetchTasksTC} from "../../state/tasks-reducer";
import {
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC, deleteTodolistTC,
    RemoveTodolistAC,
    TodolistType
} from "../../state/todolists-reducer";
import Task from "../Task/Task";
import {Button} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import styles from '../../styles/Todolist.module.css'
import {TaskDomainType, TaskStatuses} from "../../api/todolist-api";


type TodolistPropsType = {
    todolist: TodolistType
}

const Todolist: React.FC<TodolistPropsType> = memo(({todolist}) => {
    const {id, title, filter} = todolist
    const tasks = useSelector<AppRootStateType, TaskDomainType[]>(state => state.tasks[id])

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTasksTC(id))
    }, []);


    const addItemHandler = useCallback((value: string) => {
        dispatch(addTaskTC(id ,value))
    }, [dispatch])

    const onRemoveTodoHandler = () => {
        dispatch(deleteTodolistTC(id))
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

    const tasksForTodo: TaskDomainType[] = filter === 'All'
        ? tasks
        : filter === 'Completed'
            ? tasks.filter(t => t.status === TaskStatuses.Completed)
            : tasks.filter(t => t.status === TaskStatuses.New)


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