export interface Task {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  id: number;
}