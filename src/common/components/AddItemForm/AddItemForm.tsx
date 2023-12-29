import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import TextField from '@mui/material/TextField/TextField'
import styles from './AddItemForm.module.css'
import IconButton from '@mui/material/IconButton'
import { AddBox } from '@mui/icons-material'
import { BaseResponseType } from 'common/types/BaseResponseType'

type Props = {
    label: string
    addItem: (title: string) => Promise<any>
    fullWidth?: boolean
    disabled?: boolean
}

export const AddItemForm = ({ label, addItem, disabled }: Props) => {
    const [value, setValue] = useState<string>('')
    const [error, setError] = useState<boolean>(false)
    const [errorDescription, setErrorDescription] = useState<null | string>(null)

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (error) {
            setError(false)
        }

        setValue(event.currentTarget.value)
    }

    const addItemHandler = () => {
        if (value.trim() === '') {
            setError(true)
            setErrorDescription('Title is required')
            return
        }

        addItem(value)
            .then(() => {
                setValue('')
            })
            .catch((err: BaseResponseType) => {
                setError(true)
                if (err?.resultCode) {
                    setErrorDescription(err.messages[0])
                }
            })
    }

    const keyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (value.trim() === '' && e.key === 'Enter') {
            setError(true)
            setErrorDescription('Title is required')
            return
        }
        if (e.key === 'Enter') {
            addItem(value)
                .then(() => {
                    setValue('')
                })
                .catch((err: BaseResponseType) => {
                    setError(true)
                    if (err?.resultCode) {
                        setErrorDescription(err.messages[0])
                    }
                })
        }
    }

    const onBlurHandler = () => {
        if (error) setError(false)
    }

    return (
        <div className={styles.form}>
            <TextField
                label={error ? errorDescription : label}
                variant="outlined"
                onChange={onChangeHandler}
                onKeyUp={keyPressHandler}
                onBlur={onBlurHandler}
                value={value}
                error={error}
                disabled={disabled}
            />
            <IconButton onClick={addItemHandler} size="large" color="primary" disabled={disabled}>
                <AddBox />
            </IconButton>
        </div>
    )
}
