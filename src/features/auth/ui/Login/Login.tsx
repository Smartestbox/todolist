import React from 'react'
import Grid from '@mui/material/Grid'
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from '@mui/material'
import TextField from '@mui/material/TextField/TextField'
import { useFormik } from 'formik'
import { Navigate } from 'react-router-dom'
import { useAppDispatch } from 'common/hooks/useAppDispatch'
import { useAppSelector } from 'common/hooks'
import { authThunks } from 'features/auth/model/authSlice'
import { BaseResponseType } from 'common/types/BaseResponseType'

type FormikErrorsType = {
    email?: string
    password?: string
}

export const Login = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        onSubmit: (values, formikHelpers) => {
            dispatch(authThunks.login({ loginData: values }))
                .unwrap()
                .then(() => {})
                .catch((e: BaseResponseType) => {
                    e.fieldsErrors?.forEach((error) => {
                        formikHelpers.setFieldError(error.field, error.error)
                    })
                })
                .finally(() => {
                    formik.setSubmitting(false)
                })
        },
        validate: (values) => {
            const errors: FormikErrorsType = {}

            if (!values.email) {
                errors.email = 'Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }

            if (!values.password) {
                errors.password = 'Required'
            } else if (values.password.length < 5) {
                errors.password = 'Password should contain at least 5 symbols'
            }

            return errors
        },
    })

    if (isLoggedIn) {
        return <Navigate to={'/'} />
    }

    return (
        <Grid container justifyContent={'center'}>
            <Grid item justifyContent={'center'}>
                <FormControl>
                    <FormLabel>
                        <p>
                            To log in get registered
                            <a href={'https://social-network.samuraijs.com/'} target={'_blank'}>
                                {' '}
                                here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>

                    <form onSubmit={formik.handleSubmit}>
                        <FormGroup>
                            <TextField
                                name="email"
                                label="Email"
                                margin="normal"
                                error={!!(formik.touched.email && formik.errors.email)}
                                value={formik.values.email}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                helperText={formik.touched.email && formik.errors.email}
                            />

                            <TextField
                                name="password"
                                type="password"
                                label="Password"
                                margin="normal"
                                error={!!(formik.touched.password && formik.errors.password)}
                                value={formik.values.password}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                            <FormControlLabel
                                label={'Remember me'}
                                control={
                                    <Checkbox
                                        name="rememberMe"
                                        onChange={formik.handleChange}
                                        checked={formik.values.rememberMe}
                                    />
                                }
                            />
                            <Button
                                type={'submit'}
                                variant={'contained'}
                                color={'primary'}
                                disabled={formik.isSubmitting}
                            >
                                Login
                            </Button>
                        </FormGroup>
                    </form>
                </FormControl>
            </Grid>
        </Grid>
    )
}
