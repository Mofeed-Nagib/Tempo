export default interface Task {
  id: number;
  user_id: string;
  created_at: string;
  title: string;
  description: string;
  completed: boolean;
  start_date: string; // timestamptz
  end_date: string; // timestamptz
  expected_duration: number;
  actual_duration: number;
  curr_progress: number;
  priority: number;
  label?: number;
}

export interface InsertTask {
  title: string;
  description: string;
  start_date: string; // timestamptz
  end_date: string; // timestamptz
  expected_duration: number;
  priority: number;
  label?: number;
}

export interface UpdateTask {
  id: number;
  title?: string;
  description?: string;
  completed?: boolean;
  start_date?: string; // timestamptz
  end_date?: string; // timestamptz
  expected_duration?: number;
  actual_duration?: number;
  curr_progress?: number;
  priority?: number;
  label?: number;
}
