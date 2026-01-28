import { AuthToken, RefreshToken } from "../tokens";

/**
 * Authentication status enumeration
 */
export enum AuthenticationStatus {
	Authenticated = "authenticated",
	Unauthenticated = "unauthenticated",
}

/**
 * Account status enumeration
 */
export enum AccountStatus {
	Registered = "registered",
	Guest = "guest",
	Unregistered = "unregistered",
}

/**
 * Authentication account model
 */
export type AuthAccount<T> = {
	authStatus: AuthenticationStatus;
	accountStatus: AccountStatus | null;
	providerId: string | null;
	identity: string | null;
	accessToken: AuthToken | null;
	refreshToken: RefreshToken | null;
	data: T | null;
	isAuthenticated: boolean;
	hasValidAccessToken: boolean;
	hasValidRefreshToken: boolean;
};

/**
 * Create an unauthenticated account
 */
export function createUnauthenticatedAccount<T>(): AuthAccount<T> {
	return {
		authStatus: AuthenticationStatus.Unauthenticated,
		accountStatus: null,
		providerId: null,
		identity: null,
		accessToken: null,
		refreshToken: null,
		data: null,
		isAuthenticated: false,
		hasValidAccessToken: false,
		hasValidRefreshToken: false,
	};
}

/**
 * Create an authenticated account
 */
export function createAuthAccount<T>(params: {
	authStatus: AuthenticationStatus;
	accountStatus?: AccountStatus | null;
	providerId?: string | null;
	identity?: string | null;
	accessToken?: AuthToken | null;
	refreshToken?: RefreshToken | null;
	data?: T | null;
}): AuthAccount<T> {
	const hasValidAccessToken = params.accessToken?.isValid ?? false;
	const hasValidRefreshToken = params.refreshToken?.isValid ?? false;
	const isAuthenticated = params.authStatus === AuthenticationStatus.Authenticated;

	return {
		authStatus: params.authStatus,
		accountStatus: params.accountStatus ?? null,
		providerId: params.providerId ?? null,
		identity: params.identity ?? null,
		accessToken: params.accessToken ?? null,
		refreshToken: params.refreshToken ?? null,
		data: params.data ?? null,
		isAuthenticated,
		hasValidAccessToken,
		hasValidRefreshToken,
	};
}

/**
 * Copy account with changes
 */
export function copyAuthAccount<T>(
	account: AuthAccount<T>,
	changes: Partial<Omit<AuthAccount<T>, "isAuthenticated" | "hasValidAccessToken" | "hasValidRefreshToken">>,
): AuthAccount<T> {
	const updated = {
		authStatus: changes.authStatus ?? account.authStatus,
		accountStatus: changes.accountStatus !== undefined ? changes.accountStatus : account.accountStatus,
		providerId: changes.providerId !== undefined ? changes.providerId : account.providerId,
		identity: changes.identity !== undefined ? changes.identity : account.identity,
		accessToken: changes.accessToken !== undefined ? changes.accessToken : account.accessToken,
		refreshToken: changes.refreshToken !== undefined ? changes.refreshToken : account.refreshToken,
		data: changes.data !== undefined ? changes.data : account.data,
	};

	return createAuthAccount(updated);
}
