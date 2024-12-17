export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export enum TaskStatus {
  OPEN = 'open',
  IN_PROPGRESS = 'in_progress',
  DONE = 'done',
}
