import { AppAuthAccount, AppUserData } from "@/core/services/auth/models/app-auth-account";
import { authClient, noAuthClient } from "../index";

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
		const response = await noAuthClient.post<AppAuthAccount>(UserApi.SignIn, { data });
		return response.body;
	}

	async signup(data: SignUpReq) {
		const response = await noAuthClient.post<AppAuthAccount>(UserApi.SignUp, { data });
		return response.body;
	}

	async logout() {
		const response = await authClient.get(UserApi.Logout);
		return response.body;
	}

	async findById(id: string) {
		const response = await authClient.get<AppUserData[]>(`${UserApi.User}/${id}`);
		return response.body;
	}
}

export default new UserService();
