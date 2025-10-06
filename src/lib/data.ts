export type Project = {
  id: number; // Changed to number for SERIAL PRIMARY KEY
  name: string;
  domain: string | null;
  owner_id: string | null;
  created_at: string;
  feedbackCount?: number; // Optional, can be derived
  color?: string; // Optional, can be derived or removed if not from DB
};

export type Feedback = {
  id: string; // Changed to string for UUID
  user_id: string; // Added for Supabase linking
  project_id: number; // Linked to projects table
  title: string;
  description: string;
  type: "bug" | "feature";
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  created_at: string; // Changed to string for timestamp
  user_email: string;
};
