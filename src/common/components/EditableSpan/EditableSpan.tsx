import React, { ChangeEvent, KeyboardEvent, memo, useState } from 'react'

type EditableSpanType = {
    title: string
    changeItemTitle: (title: string) => void
}

export const EditableSpan: React.FC<EditableSpanType> = memo(({ title, changeItemTitle }) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [value, setValue] = useState<string>(title)

    const onDoubleClickHandler = () => {
        setEditMode(true)
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && value !== '' && value.length < 101) {
            changeItemTitle(value)
            setEditMode(false)
        }
    }
    const onBlurHandler = () => {
        if (value !== '' && value.length < 101) {
            changeItemTitle(value)
            setEditMode(false)
        }
    }

    return editMode ? (
        <input
            type={'text'}
            value={value}
            onChange={onChangeHandler}
            onKeyPress={onKeyPressHandler}
            onBlur={onBlurHandler}
            autoFocus
        />
    ) : (
        <span onDoubleClick={onDoubleClickHandler}>{value}</span>
    )
})
