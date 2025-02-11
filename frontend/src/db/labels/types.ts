export default interface Label {
  id: number;
  user_id: string;
  created_at: string;
  name: string;
  description: string;
  color: string;
}

export interface InsertLabel {
  name: string;
  description: string;
  color: string;
}

export interface UpdateLabel {
  id: number;
  name?: string;
  description?: string;
  color?: string;
}
