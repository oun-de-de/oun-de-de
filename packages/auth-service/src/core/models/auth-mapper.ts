import { AuthLoginDTO, AuthOtpDTO } from "./auth-dto";
import { AuthAccount } from "./auth-account";
import { AuthProvider, AuthCredential } from "../providers";
import { PhoneAuthOtp } from "./phone-auth-otp";

/**
 * Mapper interface for converting DTOs to AuthAccount
 */
export type AuthAccountMapper<T extends AuthAccount<TData>, TData> = {
	/**
	 * Get auth account from login DTO
	 */
	fromLogin(dto: AuthLoginDTO<T>, provider?: AuthProvider<T>, credential?: AuthCredential | null): T;
};

/**
 * Mapper interface for phone auth OTP
 */
export type PhoneOtpMapper<T extends AuthAccount<TData>, TData> = {
	/**
	 * Get phone auth OTP from OTP DTO
	 */
	fromRequestOtp(dto: AuthOtpDTO<T>, provider?: AuthProvider<T>, credential?: AuthCredential | null): PhoneAuthOtp<T>;
};
