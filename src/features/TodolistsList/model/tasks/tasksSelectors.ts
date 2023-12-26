import { RootStateType } from 'app/store'

export const selectTasks = (id: string) => (state: RootStateType) => state.tasks[id]
