import { AxiosResponseHeaders, RawAxiosResponseHeaders } from "axios";

// Network Response Wrapper
export interface NetworkResponse<T> {
	body: T | null;
	statusCode: number | undefined;
	headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
}
