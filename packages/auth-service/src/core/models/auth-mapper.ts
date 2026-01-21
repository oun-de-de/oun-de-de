import { AuthLoginDTO, AuthOtpDTO } from "./auth-dto";
import { AuthAccount } from "./auth-account";
import { AuthProvider, AuthCredential } from "../providers";
import { PhoneAuthOtp } from "./phone-auth-otp";

/**
 * Mapper interface for converting DTOs to AuthAccount
 */
export type AuthAccountMapper<T extends AuthAccount<TData>, TData = unknown, DtoData = unknown> = {
	/**
	 * Get auth account from login DTO
	 */
	fromLogin(dto: AuthLoginDTO<DtoData>, provider?: AuthProvider<DtoData>, credential?: AuthCredential | null): T;
};

/**
 * Mapper interface for phone auth OTP
 */
export type PhoneOtpMapper<D = unknown> = {
	/**
	 * Get phone auth OTP from OTP DTO
	 */
	fromRequestOtp(dto: AuthOtpDTO<D>, provider?: AuthProvider<D>, credential?: AuthCredential | null): PhoneAuthOtp<D>;
};
