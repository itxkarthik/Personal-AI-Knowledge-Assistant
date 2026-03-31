const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

export const apiConfig = {
	baseUrl: API_BASE_URL,
	timeoutMs: 15000,
	csrfHeaderName: "X-CSRF-Token",
	endpoints: {
		login: "/login/access-token",
		register: "/users/signup",
		refresh: "/auth/refresh",
		me: "/users/me",
		logout: "/auth/logout",
	},
};

export const tokenKeys = {
	access: "auth-access-token",
	refresh: "auth-refresh-token",
	csrf: "csrf-token",
};
