import { AuthProvider } from "../providers";

/**
 * Interface for authentication provider manager
 */
export interface AuthProviderManagerPlatform<T> {
	/**
	 * Map of registered providers
	 */
	readonly providers: Map<string, AuthProvider<T>>;
	/**
	 * Get provider by ID
	 */
	getProvider(providerId: string): AuthProvider<T> | null;

	/**
	 * Get default provider (first registered)
	 */
	getDefaultProvider(): AuthProvider<T> | null;
}

/**
 * Default implementation of provider manager
 */
export class AuthProviderManager<T> implements AuthProviderManagerPlatform<T> {
	public readonly providers: Map<string, AuthProvider<T>>;

	constructor(config: { providers: AuthProvider<T>[] }) {
		this.providers = new Map(config.providers.map((provider) => [provider.providerId, provider]));
	}

	getProvider(providerId: string): AuthProvider<T> | null {
		return this.providers.get(providerId) ?? null;
	}

	getDefaultProvider(): AuthProvider<T> | null {
		const firstProvider = this.providers.values().next().value;
		return firstProvider ?? null;
	}

	/**
	 * Add a provider dynamically
	 */
	addProvider(provider: AuthProvider<T>): void {
		this.providers.set(provider.providerId, provider);
	}

	/**
	 * Remove a provider
	 */
	removeProvider(providerId: string): boolean {
		return this.providers.delete(providerId);
	}

	/**
	 * Check if provider exists
	 */
	hasProvider(providerId: string): boolean {
		return this.providers.has(providerId);
	}
}
