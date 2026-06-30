export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  avatar?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  userId: string;
  userName?: string;
  facilityName: string;
  location: string;
  category: string;
  priority: string;
  description: string;
  photos: string[];
  date: string;
  status: "Menunggu" | "Diproses" | "Selesai" | "Ditolak";
  adminNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportStats {
  total: number;
  menunggu: number;
  diproses: number;
  selesai: number;
  ditolak: number;
  thisMonth: number;
}

export type ReportStatus = "Menunggu" | "Diproses" | "Selesai" | "Ditolak";

export interface ChatMessage {
  id: string;
  reportId: string;
  senderId: string;
  senderName: string;
  senderRole: "user" | "admin" | "bot";
  message: string;
  createdAt: string;
}
