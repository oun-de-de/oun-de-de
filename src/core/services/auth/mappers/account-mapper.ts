import type { AuthAccount, AuthAccountMapper, AuthCredential, AuthLoginDTO, AuthProvider } from "@auth-service";
import { AccountStatus, AuthenticationStatus, createAuthAccount, JWTToken, RefreshToken } from "@auth-service";
import type { AppAuthAccount, AppUserData } from "../models/app-auth-account";

/**
 * Mapper for converting AuthLoginDTO to AppAuthAccount
 */
export class AppAuthAccountMapper implements AuthAccountMapper<AppAuthAccount, AppUserData> {
	fromLogin(
		dto: AuthLoginDTO<AppAuthAccount>,
		provider?: AuthProvider<AppAuthAccount>,
		credential?: AuthCredential | null,
	): AuthAccount<AppUserData> {
		const data = dto.data;

		return createAuthAccount<AppUserData>({
			authStatus: AuthenticationStatus.Authenticated,
			accountStatus: AccountStatus.Registered,
			providerId: provider?.providerId ?? null,
			identity: credential?.identity ?? null,
			accessToken: JWTToken.fromValue(data.accessToken?.value || ""),
			refreshToken: new RefreshToken(data.refreshToken?.value || ""),
			data: data.data,
		});
	}
}
