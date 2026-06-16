// Typed API client — the only place in the frontend that talks to the backend.
// Every component imports from here, never writes raw fetch calls.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

// Consistent response shape mirrors the backend
type ApiResponse<T> = { success: true; data: T } | { success: false; error: { code: string; message: string } };

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
}

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_active: boolean;
};

export type MenuItem = {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: string;
  image_url: string | null;
  model_url: string | null;
  sort_order: number;
  is_available: boolean;
};

// ─── Public API (no auth needed) ─────────────────────────────────────────────

export const publicApi = {
  getRestaurantBySlug: (slug: string) =>
    request<Restaurant>(`/restaurants/slug/${slug}`),

  getMenuItems: (restaurantId: string) =>
    request<MenuItem[]>(`/restaurants/${restaurantId}/menu-items`),
};

// ─── Admin API (requires JWT token) ──────────────────────────────────────────

export const adminApi = {
  auth: {
    login: (email: string, password: string) =>
      request<{ user: { id: string; email: string; role: string }; accessToken: string; refreshToken: string }>(
        "/auth/login",
        { method: "POST", body: JSON.stringify({ email, password }) }
      ),
    logout: (refreshToken: string) =>
      request<{ message: string }>("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }),
    refresh: (refreshToken: string) =>
      request<{ accessToken: string; refreshToken: string }>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }),
  },

  restaurants: {
    getAll: (token: string) =>
      request<Restaurant[]>("/restaurants", { headers: authHeader(token) }),
    create: (token: string, data: { name: string; logo_url?: string }) =>
      request<Restaurant>("/restaurants", {
        method: "POST",
        headers: authHeader(token),
        body: JSON.stringify(data),
      }),
    update: (token: string, id: string, data: Partial<Restaurant>) =>
      request<Restaurant>(`/restaurants/${id}`, {
        method: "PATCH",
        headers: authHeader(token),
        body: JSON.stringify(data),
      }),
    delete: (token: string, id: string) =>
      request<{ message: string }>(`/restaurants/${id}`, {
        method: "DELETE",
        headers: authHeader(token),
      }),
  },

  menuItems: {
    create: (token: string, restaurantId: string, data: Partial<MenuItem> & { name: string; price: number }) =>
      request<MenuItem>(`/restaurants/${restaurantId}/menu-items`, {
        method: "POST",
        headers: authHeader(token),
        body: JSON.stringify(data),
      }),
    update: (token: string, restaurantId: string, id: string, data: Partial<MenuItem>) =>
      request<MenuItem>(`/restaurants/${restaurantId}/menu-items/${id}`, {
        method: "PATCH",
        headers: authHeader(token),
        body: JSON.stringify(data),
      }),
    delete: (token: string, restaurantId: string, id: string) =>
      request<{ message: string }>(`/restaurants/${restaurantId}/menu-items/${id}`, {
        method: "DELETE",
        headers: authHeader(token),
      }),
  },
};
