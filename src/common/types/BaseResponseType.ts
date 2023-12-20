type FieldsErrors = {
    field: string
    error: string
}

export type BaseResponseType<D = {}> = {
    data: D
    messages: string[]
    fieldsErrors: FieldsErrors[]
    resultCode: number
}
