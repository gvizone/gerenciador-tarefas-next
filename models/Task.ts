export interface Task {
  _id?: string,
  name: string,
  userId: string,
  finishPrevisionDate: Date,
  finishDate?: Date
}
