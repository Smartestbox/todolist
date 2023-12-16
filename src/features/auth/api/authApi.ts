import { instance } from 'common/api/instance'
import { ResponseType } from 'common/types/responseType'

export const authAPI = {
    me() {
        return instance.get<ResponseType<UserType>>('auth/me')
    },
    login(loginData: LoginDataType) {
        return instance.post<ResponseType<{ userId: number }>>('auth/login', loginData)
    },
    logout() {
        return instance.delete<ResponseType>('auth/login')
    },
}

export type LoginDataType = {
    email: string
    password: string
    rememberMe: boolean
}

export type UserType = {
    id: number
    email: string
    login: string
}
