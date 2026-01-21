import { AuthCredential } from "../providers";

/**
 * Base data transfer object for authentication
 */
export type AuthDTO<D = unknown> = {
	credential: AuthCredential | null;
	data: D;
};

/**
 * Data transfer object for login operations
 */
export type AuthLoginDTO<D = unknown> = {
	credential: AuthCredential | null;
	data: D;
};

/**
 * Create auth login DTO
 */
export function createAuthLoginDTO<D = unknown>(params: {
	credential?: AuthCredential | null;
	data: D;
}): AuthLoginDTO<D> {
	return {
		credential: params.credential ?? null,
		data: params.data,
	};
}

/**
 * Data transfer object for OTP operations
 */
export type AuthOtpDTO<D = unknown> = {
	credential: AuthCredential | null;
	data: D;
};

/**
 * Create auth OTP DTO
 */
export function createAuthOtpDTO<D = unknown>(params: { credential?: AuthCredential | null; data: D }): AuthOtpDTO<D> {
	return {
		credential: params.credential ?? null,
		data: params.data,
	};
}
