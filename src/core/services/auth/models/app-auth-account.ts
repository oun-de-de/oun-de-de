import type { AuthAccount } from "@auth-service";
import type { UserInfo } from "@/core/types/entity";

/**
 * Application-specific user data
 */
export interface AppUserData {
	id: string;
	username: string;
	email: string;
	phoneNumber?: string;
	avatar?: string;
	roles: string[];
	permissions: string[];
	// Include UserInfo fields
	status?: UserInfo["status"];
}

/**
 * Application auth account type
 */
export type AppAuthAccount = AuthAccount<AppUserData>;

/**
 * Helper functions for AppAuthAccount
 */
export const AppAuthAccountHelpers = {
	/**
	 * Get user ID
	 */
	getUserId(account: AppAuthAccount): string {
		return account.data?.data?.id ?? "";
	},

	/**
	 * Get username
	 */
	getUsername(account: AppAuthAccount): string {
		return account.data?.data?.username ?? "";
	},

	/**
	 * Get email
	 */
	getEmail(account: AppAuthAccount): string | undefined {
		return account.data?.data?.email;
	},

	/**
	 * Get phone number
	 */
	getPhoneNumber(account: AppAuthAccount): string | undefined {
		return account.data?.data?.phoneNumber;
	},

	/**
	 * Get avatar URL
	 */
	getAvatar(account: AppAuthAccount): string | undefined {
		return account.data?.data?.avatar;
	},

	/**
	 * Get user roles
	 */
	getRoles(account: AppAuthAccount): string[] {
		return account.data?.data?.roles ?? [];
	},

	/**
	 * Get user permissions
	 */
	getPermissions(account: AppAuthAccount): string[] {
		return account.data?.data?.permissions ?? [];
	},

	/**
	 * Check if user has specific role
	 */
	hasRole(account: AppAuthAccount, role: string): boolean {
		return this.getRoles(account).includes(role);
	},

	/**
	 * Check if user has specific permission
	 */
	hasPermission(account: AppAuthAccount, permission: string): boolean {
		return this.getPermissions(account).includes(permission);
	},

	/**
	 * Check if user has any of the specified roles
	 */
	hasAnyRole(account: AppAuthAccount, roles: string[]): boolean {
		return roles.some((role) => this.hasRole(account, role));
	},

	/**
	 * Check if user has any of the specified permissions
	 */
	hasAnyPermission(account: AppAuthAccount, permissions: string[]): boolean {
		return permissions.some((permission) => this.hasPermission(account, permission));
	},
};
