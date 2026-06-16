import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { authRepository } from "./auth.repository";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function generateTokens(userId: string, email: string, role: string) {
  const payload = { userId, email, role };

  const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

  return { accessToken, refreshToken };
}

export const authService = {
  async register(email: string, password: string) {
    const existing = await authRepository.findByEmail(email);
    if (existing) throw new Error("Email already in use");

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await authRepository.createUser(email, passwordHash);

    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    await authRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

    return { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken };
  },

  async login(email: string, password: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new Error("Invalid credentials");

    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    await authRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

    return { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken };
  },

  async refresh(token: string) {
    const stored = await authRepository.findRefreshToken(token);
    if (!stored) throw new Error("Invalid or expired refresh token");

    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string; email: string; role: string };
    await authRepository.deleteRefreshToken(token);

    const { accessToken, refreshToken } = generateTokens(payload.userId, payload.email, payload.role);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    await authRepository.saveRefreshToken(payload.userId, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  },

  async logout(token: string) {
    await authRepository.deleteRefreshToken(token);
  },
};
