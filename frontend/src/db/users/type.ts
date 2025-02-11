export default interface User {
  user_id: string;
  created_at: string;
  gcal_auth_token: string;
  webhook_resource_id: string;
}

export interface UpdateUser {
  user_id: string;
  gcal_auth_token?: string;
  webhook_resource_id?: string;
}
