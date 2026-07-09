interface OTPEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

const store = new Map<string, OTPEntry>();
const OTP_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 3;
const COOLDOWN = 60 * 1000; // 60 seconds between sends

const lastSent = new Map<string, number>();

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function canSendOTP(email: string): boolean {
  const last = lastSent.get(email);
  if (!last) return true;
  return Date.now() - last >= COOLDOWN;
}

export function storeOTP(email: string, code: string): void {
  store.set(email, {
    code,
    expiresAt: Date.now() + OTP_TTL,
    attempts: 0,
  });
  lastSent.set(email, Date.now());
}

export function verifyOTP(email: string, code: string): { valid: boolean; reason?: string } {
  const entry = store.get(email);
  if (!entry) {
    return { valid: false, reason: "Kode verifikasi tidak ditemukan. Silakan minta kode baru." };
  }

  if (Date.now() > entry.expiresAt) {
    store.delete(email);
    return { valid: false, reason: "Kode verifikasi sudah kedaluwarsa. Silakan minta kode baru." };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    store.delete(email);
    return { valid: false, reason: "Batas percobaan tercapai. Silakan minta kode baru." };
  }

  entry.attempts++;

  if (entry.code !== code) {
    return { valid: false, reason: `Kode verifikasi salah. Sisa percobaan: ${MAX_ATTEMPTS - entry.attempts}` };
  }

  store.delete(email);
  return { valid: true };
}

export function cleanupExpired(): void {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.expiresAt) {
      store.delete(key);
    }
  }
}

// Auto cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpired, 5 * 60 * 1000);
}
