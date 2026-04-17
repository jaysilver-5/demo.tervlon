// Shared types between frontend and backend
// This will grow as we build out the platform

export type Role = "LEARNER" | "INSTRUCTOR" | "ADMIN";

export interface EarlyAccessSignup {
  email: string;
  role: "Instructor" | "Developer" | "Other";
  createdAt: string;
}
