import * as React from 'react'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { useDispatch } from 'react-redux'
import { appActions } from '../../../app/app-reducer'
import { selectAppError } from '../../../app/app-selectors'
import { useAppSelector } from '../../hooks/useAppSelector'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export const ErrorSnackbar = () => {
    const error = useAppSelector<null | string>(selectAppError)
    const dispatch = useDispatch()

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        dispatch(appActions.setAppError({ error: null }))
    }

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="error">{error}</Alert>
            </Snackbar>
        </Stack>
    )
}