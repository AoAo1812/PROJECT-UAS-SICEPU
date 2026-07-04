import fs from "fs";
import path from "path";
import { User, Report, ReportStats, ChatMessage } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const REPORTS_FILE = path.join(DATA_DIR, "reports.json");
const CHATS_FILE = path.join(DATA_DIR, "chats.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJson<T>(filePath: string, fallback: T): T {
  ensureDataDir();
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
      return fallback;
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(filePath: string, data: T) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Users
export function getUsers(): User[] {
  return readJson<User[]>(USERS_FILE, []);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email);
}

export function createUser(user: User): User {
  const users = getUsers();
  users.push(user);
  writeJson(USERS_FILE, users);
  return user;
}

export function updateUser(id: string, data: Partial<User>): User | null {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...data };
  writeJson(USERS_FILE, users);
  return users[idx];
}

export function updateUserPassword(email: string, hashedPassword: string): boolean {
  const users = getUsers();
  const idx = users.findIndex((u) => u.email === email);
  if (idx === -1) return false;
  users[idx] = { ...users[idx], password: hashedPassword };
  writeJson(USERS_FILE, users);
  return true;
}

export function deleteUser(id: string): boolean {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  writeJson(USERS_FILE, filtered);
  return true;
}

// Reports
export function getReports(): Report[] {
  return readJson<Report[]>(REPORTS_FILE, []);
}

export function getReportById(id: string): Report | undefined {
  return getReports().find((r) => r.id === id);
}

export function getReportsByUserId(userId: string): Report[] {
  return getReports().filter((r) => r.userId === userId);
}

export function createReport(report: Report): Report {
  const reports = getReports();
  reports.push(report);
  writeJson(REPORTS_FILE, reports);
  return report;
}

export function updateReport(id: string, data: Partial<Report>): Report | null {
  const reports = getReports();
  const idx = reports.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  reports[idx] = { ...reports[idx], ...data };
  writeJson(REPORTS_FILE, reports);
  return reports[idx];
}

export function deleteReport(id: string): boolean {
  const reports = getReports();
  const filtered = reports.filter((r) => r.id !== id);
  if (filtered.length === reports.length) return false;
  writeJson(REPORTS_FILE, filtered);
  return true;
}

export function getReportStats(): ReportStats {
  const reports = getReports();
  const now = new Date();
  const thisMonth = reports.filter((r) => {
    const d = new Date(r.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  return {
    total: reports.length,
    menunggu: reports.filter((r) => r.status === "Menunggu").length,
    diproses: reports.filter((r) => r.status === "Diproses").length,
    selesai: reports.filter((r) => r.status === "Selesai").length,
    ditolak: reports.filter((r) => r.status === "Ditolak").length,
    thisMonth: thisMonth.length,
  };
}

export function getMonthlyReportData(): { month: string; count: number }[] {
  const reports = getReports();
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const now = new Date();
  const result: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const count = reports.filter((r) => {
      const rd = new Date(r.createdAt);
      return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear();
    }).length;
    result.push({ month: months[d.getMonth()], count });
  }
  return result;
}

export function getWeeklyReportData(): { month: string; count: number }[] {
  const reports = getReports();
  const now = new Date();
  const result: { month: string; count: number }[] = [];
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (i * 7 + now.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    const count = reports.filter((r) => {
      const rd = new Date(r.createdAt);
      return rd >= weekStart && rd <= weekEnd;
    }).length;
    const label = `${weekStart.getDate()}/${weekStart.getMonth() + 1}`;
    result.push({ month: label, count });
  }
  return result;
}

export function getYearlyReportData(): { month: string; count: number }[] {
  const reports = getReports();
  const now = new Date();
  const result: { month: string; count: number }[] = [];
  for (let i = 4; i >= 0; i--) {
    const year = now.getFullYear() - i;
    const count = reports.filter((r) => {
      const rd = new Date(r.createdAt);
      return rd.getFullYear() === year;
    }).length;
    result.push({ month: String(year), count });
  }
  return result;
}

// Chats
export function getChats(): ChatMessage[] {
  return readJson<ChatMessage[]>(CHATS_FILE, []);
}

export function getChatsByReportId(reportId: string): ChatMessage[] {
  return getChats().filter((c) => c.reportId === reportId);
}

export function getChatsByUserId(userId: string): ChatMessage[] {
  return getChats().filter((c) => c.senderId === userId);
}

export function createChatMessage(message: ChatMessage): ChatMessage {
  const chats = getChats();
  chats.push(message);
  writeJson(CHATS_FILE, chats);
  return message;
}

export function getUnreadChatCount(): number {
  const chats = getChats();
  return chats.filter((c) => c.senderRole === "user").length;
}

export function getActiveConversations(): number {
  const reports = getReports();
  return reports.filter((r) => r.status === "Menunggu" || r.status === "Diproses").length;
}
