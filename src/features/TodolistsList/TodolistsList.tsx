import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootStateType, useAppDispatch} from "../../components/App/store";
import {fetchTodolistsTC, TodolistType} from "./todolists-reducer";
import Grid from "@mui/material/Grid";
import {Paper} from "@mui/material";
import Todolist from "./Todolist/Todolist";

const TodolistsList: React.FC = () => {
    const todolists = useSelector<RootStateType, TodolistType[]>(state => state.todolists)

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [])

    return (
        <Grid container spacing={2}>
            {
                todolists.map(tl =>
                    <Grid item key={tl.id}>
                        <Paper elevation={3} sx={{padding: '20px'}}>
                            <Todolist
                                todolist={tl}
                                entityStatus={tl.entityStatus}
                            />
                        </Paper>
                    </Grid>
                )
            }
        </Grid>
    )
}

export default TodolistsList