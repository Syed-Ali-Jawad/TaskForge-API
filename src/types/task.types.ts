interface TaskBody {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate: string;
  assigneeId: string;
  reporterId: string;
}

export { TaskBody };
