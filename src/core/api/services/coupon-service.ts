import type { PagePaginatedResponse } from "@/core/types/common";
import type { Coupon, CreateCouponRequest } from "@/core/types/coupon";
import type { Pagination } from "@/core/types/pagination";
import { mapPagePaginatedResponseToPagination } from "@/core/utils/pagination";
import { apiClient } from "../apiClient";

export enum CouponApi {
	List = "/coupons",
	Create = "/coupons",
}

const getCouponList = (params?: { page?: number; limit?: number; customerId?: string }): Promise<Pagination<Coupon>> =>
	apiClient
		.get<PagePaginatedResponse<Coupon>>({
			url: CouponApi.List,
			params: {
				page: params?.page ? params.page - 1 : 0,
				size: params?.limit,
				customer_id: params?.customerId,
			},
		})
		.then(mapPagePaginatedResponseToPagination);

const createCoupon = (coupon: CreateCouponRequest) => apiClient.post<Coupon>({ url: CouponApi.Create, data: coupon });

export default {
	getCouponList,
	createCoupon,
};
