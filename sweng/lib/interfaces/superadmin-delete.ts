export interface SuperAdminDeletionRequest {
  reason: string;
}

export interface SuperAdminDeletionResponse {
  success: boolean;
  message?: string;
  error?: string;
  donor?: {
    id: string;
    active: boolean;
    delete_datetime: string | null;
    deleted_by: string | null;
    delete_reason: string | null;
  };
}