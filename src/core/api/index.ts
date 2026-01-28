import { AuthNetworkService, NetworkService, NoAuthNetworkService } from "./network-service";

/**
 * Base API interface
 */
export interface BaseApi {
	readonly client: NetworkService;
	readonly noAuthClient: NetworkService;
}

// Export lazy proxies so `getInstance()` is invoked only when a method/property
// is actually accessed. This avoids temporal-dead-zone errors caused by
// circular imports during module initialization.
// function createLazyClient<T extends object>(getter: () => T): T {
// 	return new Proxy({} as T, {
// 		get(_, prop: string | symbol) {
// 			const target = getter() as any;
// 			const value = target[prop as any];
// 			return typeof value === "function" ? value.bind(target) : value;
// 		},
// 		set(_, prop: string | symbol, value) {
// 			const target = getter() as any;
// 			target[prop as any] = value;
// 			return true;
// 		},
// 		has(_, prop: string | symbol) {
// 			const target = getter() as any;
// 			return prop in target;
// 		},
// 	});
// }

// export const authClient = createLazyClient(() => AuthNetworkService.getInstance());
// export const noAuthClient = createLazyClient(() => NoAuthNetworkService.getInstance());

/**
 * Main API abstract class
 * Provides authenticated and non-authenticated network clients
 */
export abstract class MainApi implements BaseApi {
	get client(): NetworkService {
		return AuthNetworkService.getInstance();
	}

	get noAuthClient(): NetworkService {
		return NoAuthNetworkService.getInstance();
	}
}
