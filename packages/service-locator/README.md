# Service Locator

A highly optimized service locator / dependency injection container for TypeScript, inspired by [get_it](https://pub.dev/packages/get_it).

## Features

- **Multiple registration types**: Singleton, lazy singleton, factory, cached factory
- **Scoped services**: Create and manage nested scopes
- **Async initialization**: Support for async service creation
- **WeakReference support**: Memory optimization for weak references
- **Reference counting**: Automatic lifecycle management
- **Dependency resolution**: Automatic dependency graph handling
- **Lifecycle methods**: Auto-detection of `initialize()` and `dispose()` methods
- **Debug statistics**: Performance monitoring and debugging tools

## Installation

```bash
npm install service-locator
# or
pnpm add service-locator
```

## Usage

```typescript
import { GetIt } from "service-locator";

const locator = GetIt.instance;

// Register singleton
locator.registerSingleton<UserService>(new UserServiceImpl());

// Register lazy singleton
locator.registerLazySingleton<UserService>(() => new UserServiceImpl());

// Register factory (always new instance)
locator.registerFactory<UserService>(() => new UserServiceImpl());

// Register cached factory
locator.registerCachedFactory<UserService>(() => new UserServiceImpl());

// Get service
const userService = locator.get<UserService>();

// Get async
const service = await locator.getAsync<UserService>();

// Check if registered
if (locator.isRegistered<UserService>()) {
	// Service is registered
}

// Reset all services
await locator.reset();
```

## Scopes

```typescript
// Create a new scope
locator.pushNewScope({
	name: "page",
	init: (locator) => {
		// Register page-scoped services
		locator.registerSingleton<PageService>(new PageServiceImpl());
	},
});

// Pop the scope
await locator.popScope();

// Pop scopes until a specific one is on top
await locator.popScopesTill("baseScope");
```

## Lifecycle Hooks

Services can implement `Initializable` and `Disposable` interfaces:

```typescript
interface Initializable {
	initialize(): void | Promise<void>;
}

interface Disposable {
	dispose(): void | Promise<void>;
}

class MyService implements Initializable, Disposable {
	async initialize(): Promise<void> {
		// Setup code
	}

	async dispose(): Promise<void> {
		// Cleanup code
	}
}
```

## License

MIT
