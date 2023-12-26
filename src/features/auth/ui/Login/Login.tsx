import React from 'react'
import Grid from '@mui/material/Grid'
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from '@mui/material'
import TextField from '@mui/material/TextField/TextField'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from 'common/hooks'
import { useLogin } from 'features/auth/ui/Login/useLogin'

export const Login = () => {
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

    const { formik } = useLogin()

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
