import { instance } from 'common/api/instance'
import { BaseResponseType } from 'common/types/BaseResponseType'

export const authAPI = {
    me() {
        return instance.get<BaseResponseType<UserType>>('auth/me')
    },
    login(loginData: LoginDataType) {
        return instance.post<BaseResponseType<{ userId: number }>>('auth/login', loginData)
    },
    logout() {
        return instance.delete<BaseResponseType>('auth/login')
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
