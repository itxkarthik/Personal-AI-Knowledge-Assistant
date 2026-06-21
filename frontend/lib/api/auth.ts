import { apiConfig } from "@/config/api";
import { apiClient } from "@/lib/api/client";
import type {
	LoginRequest,
	MessageResponse,
	RegisterRequest,
	TokenResponse,
	User,
} from "@/types";
import { APIRequestError } from "@/lib/api/client";

export async function login(payload: LoginRequest): Promise<TokenResponse> {
	const body = new URLSearchParams();
	body.set("username", payload.email);
	body.set("password", payload.password);

	try {
		const response = await apiClient.post<TokenResponse>(
			apiConfig.endpoints.login,
			body,
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);
		return response.data;
	} catch (error) {
		if (error instanceof APIRequestError) {
			throw error;
		}
		throw new APIRequestError("Failed to login", {
			errorCode: "LOGIN_FAILED",
		});
	}
}

export async function register(payload: RegisterRequest): Promise<User> {
	try {
		const response = await apiClient.post<User>(apiConfig.endpoints.register, payload);
		return response.data;
	} catch (error) {
		if (error instanceof APIRequestError) {
			throw error;
		}
		throw new APIRequestError("Failed to register", {
			errorCode: "REGISTER_FAILED",
		});
	}
}

export async function refreshToken(refresh_token?: string): Promise<TokenResponse> {
	try {
		const response = await apiClient.post<TokenResponse>(apiConfig.endpoints.refresh, {
			refresh_token,
		});
		return response.data;
	} catch (error) {
		if (error instanceof APIRequestError) {
			throw error;
		}
		throw new APIRequestError("Failed to refresh token", {
			errorCode: "TOKEN_REFRESH_FAILED",
		});
	}
}

export async function getCurrentUser(): Promise<User> {
	try {
		const response = await apiClient.get<User>(apiConfig.endpoints.me);
		return response.data;
	} catch (error) {
		if (error instanceof APIRequestError) {
			throw error;
		}
		throw new APIRequestError("Failed to get current user", {
			errorCode: "GET_USER_FAILED",
		});
	}
}

export async function logout(): Promise<MessageResponse> {
	try {
		const response = await apiClient.post<MessageResponse>(apiConfig.endpoints.logout);
		return response.data;
	} catch (error) {
		if (error instanceof APIRequestError) {
			throw error;
		}
		throw new APIRequestError("Failed to logout", {
			errorCode: "LOGOUT_FAILED",
		});
	}
}
