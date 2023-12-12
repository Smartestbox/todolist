import { RootStateType } from "../../components/App/store"

export const selectTasks = (id: string) => (state: RootStateType) => state.tasks[id]
