import type { AuthProvider, AuthProviderManagerPlatform } from "@auth-service";
import { AppUsernameAuthProvider } from "./username-auth-provider";
import { AppAuthAccount } from "../models/app-auth-account";

/**
 * Provider manager for managing authentication providers
 */
export class AppAuthProviderManager implements AuthProviderManagerPlatform<AppAuthAccount> {
	public readonly providers: Map<string, AuthProvider<AppAuthAccount>> = new Map();
	private defaultProviderId: string = "username";

	constructor() {
		// Register default providers
		this.registerProvider("username", new AppUsernameAuthProvider());
		// Add more providers as needed:
		// this.registerProvider("email", new AppEmailAuthProvider());
		// this.registerProvider("phone", new AppPhoneAuthProvider());
		// this.registerProvider("google", new AppGoogleAuthProvider());
	}

	registerProvider(providerId: string, provider: AuthProvider<AppAuthAccount>): void {
		this.providers.set(providerId, provider);
	}

	getProvider(providerId: string): AuthProvider<AppAuthAccount> | null {
		return this.providers.get(providerId) ?? null;
	}

	getDefaultProvider(): AuthProvider<AppAuthAccount> {
		const provider = this.providers.get(this.defaultProviderId);
		if (!provider) {
			throw new Error(`Default provider '${this.defaultProviderId}' not found`);
		}
		return provider;
	}

	getProviders(): AuthProvider<AppAuthAccount>[] {
		return Array.from(this.providers.values());
	}

	hasProvider(providerId: string): boolean {
		return this.providers.has(providerId);
	}
}
