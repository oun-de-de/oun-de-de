import type { AuthAccount } from "@auth-service";

/**
 * Application-specific user data (matches provider DTO)
 */
export interface AppUserData {
	user_id: string;
	username: string;
	type: string;
	roles: string[];
	permissions: string[];
}

/**
 * Application auth account type
 */
export type AppAuthAccount = AuthAccount<AppUserData>;

/**
 * Helper functions for AppAuthAccount
 */
export const AppAuthAccountHelpers = {
	/** Get user ID */
	getUserId(account: AppAuthAccount): string {
		return account.data?.user_id ?? "";
	},

	/** Get username */
	getUsername(account: AppAuthAccount): string {
		return account.data?.username ?? "";
	},

	/** Get user roles */
	getRoles(account: AppAuthAccount): string[] {
		const roles = account.data?.roles ?? [];
		return roles;
	},

	/** Check if user has specific role */
	hasRole(account: AppAuthAccount, role: string): boolean {
		return this.getRoles(account).includes(role);
	},

	/** Check if user has any of the specified roles */
	hasAnyRole(account: AppAuthAccount, roles: string[]): boolean {
		return roles.some((role) => this.hasRole(account, role));
	},

	/**
	 * Get user permissions
	 */
	getPermissions(account: AppAuthAccount): string[] {
		return account.data?.permissions ?? [];
	},

	/**
	 * Check if user has specific permission
	 */
	hasPermission(account: AppAuthAccount, permission: string): boolean {
		return this.getPermissions(account).includes(permission);
	},

	/**
	 * Check if user has any of the specified permissions
	 */
	hasAnyPermission(account: AppAuthAccount, permissions: string[]): boolean {
		return permissions.some((permission) => this.hasPermission(account, permission));
	},
};
