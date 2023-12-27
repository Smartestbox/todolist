import React from 'react'
import { Button } from '@mui/material'
import { TasksFiltersType, todolistsActions } from 'features/TodolistsList/model/todolists/todolistsSlice'
import { useAppDispatch } from 'common/hooks'

type Props = {
    id: string
    filter: TasksFiltersType
}

export const FilterTasksButtons = ({ id, filter }: Props) => {
    const dispatch = useAppDispatch()

    const filterTasksHandler = (filter: TasksFiltersType) => {
        dispatch(todolistsActions.changeTodolistFilter({ id, filter }))
    }

    return (
        <div>
            <Button
                variant={filter === 'All' ? 'contained' : 'text'}
                size="small"
                onClick={() => filterTasksHandler('All')}
            >
                All
            </Button>
            <Button
                variant={filter === 'Active' ? 'contained' : 'text'}
                size="small"
                color="warning"
                onClick={() => filterTasksHandler('Active')}
            >
                Active
            </Button>
            <Button
                variant={filter === 'Completed' ? 'contained' : 'text'}
                size="small"
                color="success"
                onClick={() => filterTasksHandler('Completed')}
            >
                Completed
            </Button>
        </div>
    )
}

export default FilterTasksButtons
