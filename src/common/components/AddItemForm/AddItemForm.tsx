import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import TextField from '@mui/material/TextField/TextField'
import styles from './AddItemForm.module.css'
import IconButton from '@mui/material/IconButton'
import { AddBox } from '@mui/icons-material'

type Props = {
    label: string
    addItem: (title: string) => void
    fullWidth?: boolean
    disabled?: boolean
}

export const AddItemForm = ({ label, addItem, disabled }: Props) => {
    const [value, setValue] = useState<string>('')
    const [error, setError] = useState<boolean>(false)

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setError(false)
        setValue(event.currentTarget.value)
    }

    const onClickHandler = () => {
        if (value.trim() === '') {
            setError(true)
            return
        }

        addItem(value)
        setValue('')
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (value.trim() === '' && e.key === 'Enter') {
            setError(true)
            return
        }
        if (e.key === 'Enter') {
            addItem(value)
            setValue('')
        }
    }

    const onBlurHandler = () => {
        if (error) setError(false)
    }

    return (
        <div className={styles.form}>
            <TextField
                label={error ? 'Title is required' : label}
                variant="outlined"
                onChange={onChangeHandler}
                onKeyUp={onKeyPressHandler}
                onBlur={onBlurHandler}
                value={value}
                error={error}
                disabled={disabled}
            />
            <IconButton onClick={onClickHandler} size="large" color="primary" disabled={disabled}>
                <AddBox />
            </IconButton>
        </div>
    )
}
