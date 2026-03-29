export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    redirect_url: string | null;
    type: "request" | "comment" | "message" | "other";
    is_read: boolean;
    created_at: Date; 
  }