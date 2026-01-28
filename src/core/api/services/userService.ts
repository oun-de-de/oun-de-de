import { AppAuthAccount, AppUserData } from "@/core/services/auth/models/app-auth-account";
import { apiClient, noAuthApi } from "../apiClient";

export interface SignInReq {
	username: string;
	password: string;
}

export interface SignUpReq extends SignInReq {
	email: string;
}

export enum UserApi {
	SignIn = "/auth/sign-in",
	SignUp = "/auth/sign-up",
	Logout = "/auth/sign-out",
	Refresh = "/auth/token/refresh",
	User = "/user",
}

class UserService {
	async signin(data: SignInReq) {
		const response = await noAuthApi.post<AppAuthAccount>({
			url: UserApi.SignIn,
			data,
		});
		return response;
	}

	async signup(data: SignUpReq) {
		const response = await noAuthApi.post<AppAuthAccount>({
			url: UserApi.SignUp,
			data,
		});
		return response;
	}

	async logout() {
		const response = await apiClient.get({
			url: UserApi.Logout,
		});
		return response;
	}

	async findById(id: string) {
		const response = await apiClient.get<AppUserData[]>({
			url: `${UserApi.User}/${id}`,
		});
		return response;
	}
}

export default new UserService();
