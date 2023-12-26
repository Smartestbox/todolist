import { useFormik } from 'formik'
import { authThunks } from 'features/auth/model/authSlice'
import { BaseResponseType } from 'common/types/BaseResponseType'
import { useAppDispatch } from 'common/hooks'

type FormikErrorsType = {
    email?: string
    password?: string
}

export const useLogin = () => {
    const dispatch = useAppDispatch()

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

    return { formik }
}
