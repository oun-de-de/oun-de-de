import type { PhoneAuthProvider, PhoneAuthCredential } from "../providers";

/**
 * Phone authentication OTP model
 */
export type PhoneAuthOtp<D = unknown> = {
	provider: PhoneAuthProvider | null;
	credential: PhoneAuthCredential | null;
	otp: string | null;
	sendDate: Date | null;
	expiresAt: Date | null;
	data: D | null;
	isExpired: boolean;
	isValid: boolean;
};

/**
 * Create phone auth OTP
 */
export function createPhoneAuthOtp<D = unknown>(params: {
	provider?: PhoneAuthProvider | null;
	credential?: PhoneAuthCredential | null;
	sendDate?: Date | null;
	otp?: string | null;
	expiresAt?: Date | null;
	data?: D | null;
}): PhoneAuthOtp<D> {
	const expiresAt = params.expiresAt ?? null;
	const otp = params.otp ?? null;
	const sendDate = params.sendDate ?? new Date();
	const isExpired = expiresAt !== null && expiresAt < new Date();
	const isValid = otp !== null && !isExpired;

	return {
		provider: params.provider ?? null,
		credential: params.credential ?? null,
		otp,
		sendDate,
		expiresAt,
		data: params.data ?? null,
		isExpired,
		isValid,
	};
}

/**
 * Copy phone auth OTP with changes
 */
export function copyPhoneAuthOtp<D = unknown>(
	phoneOtp: PhoneAuthOtp<D>,
	changes: Partial<Omit<PhoneAuthOtp<D>, "isExpired" | "isValid">>,
): PhoneAuthOtp<D> {
	return createPhoneAuthOtp({
		provider: changes.provider !== undefined ? changes.provider : phoneOtp.provider,
		credential: changes.credential !== undefined ? changes.credential : phoneOtp.credential,
		otp: changes.otp !== undefined ? changes.otp : phoneOtp.otp,
		sendDate: changes.sendDate !== undefined ? changes.sendDate : phoneOtp.sendDate,
		expiresAt: changes.expiresAt !== undefined ? changes.expiresAt : phoneOtp.expiresAt,
		data: changes.data !== undefined ? changes.data : phoneOtp.data,
	});
}
