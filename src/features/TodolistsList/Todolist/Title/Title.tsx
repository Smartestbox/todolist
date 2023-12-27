import React from 'react'
import { EditableSpan } from 'common/components'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { todolistsThunks } from 'features/TodolistsList/model/todolists/todolistsSlice'
import { useAppDispatch } from 'common/hooks'

type Props = {
    id: string
    title: string
    isDisabled: boolean
}

export const Title = ({ id, title, isDisabled }: Props) => {
    const dispatch = useAppDispatch()

    const removeTodolistHandler = () => {
        dispatch(todolistsThunks.deleteTodolist({ todolistId: id }))
    }

    const changeTodolistTitleHandler = (title: string) => {
        dispatch(todolistsThunks.changeTodolistTitle({ todolistId: id, title }))
    }
    return (
        <div>
            <EditableSpan title={title} changeItemTitle={changeTodolistTitleHandler} />

            <IconButton onClick={removeTodolistHandler} disabled={isDisabled}>
                <DeleteIcon />
            </IconButton>
        </div>
    )
}
