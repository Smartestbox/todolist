import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import TextField from "@mui/material/TextField/TextField";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import styles from '../../Styles/AddItemForm.module.css'

export type AddItemFormType = {
    label: string
    addItem: (title: string) => void
    fullWidth?: boolean
}

const AddItemForm: React.FC<AddItemFormType> = memo(({
                                                         label,
                                                         addItem
                                                     }) => {
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

    return <div>
        <div>
            {
                <TextField
                    label={error ? 'Title is required' : label}
                    variant='outlined'
                    onChange={onChangeHandler}
                    onKeyUp={onKeyPressHandler}
                    onBlur={onBlurHandler}
                    value={value}
                    error={error}
                />
            }
            <AddBoxOutlinedIcon onClick={onClickHandler} fontSize='large' color='primary'
                                sx={{'&:hover': {'cursor': 'pointer'}}}/>
        </div>
    </div>

})

export default AddItemForm;