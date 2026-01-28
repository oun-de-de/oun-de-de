import { SaleCategory } from "@/core/domain/sales/entities/sale-category";
import type { SaleProduct } from "@/core/domain/sales/entities/sale-product";
import { authClient } from "../index";
import type {
	CustomerFilter,
	EmployeeFilter,
	WarehouseFilter,
	SaleCategoryFilter,
} from "@/core/domain/sales/entities/sale-filter";
import type { SaleFilters } from "@/core/domain/sales/entities/sale-filter";
import type { Pagination } from "@/core/types/pagination";

enum SaleApiPath {
	Customers = "/sale/customers",
	Employees = "/sale/employees",
	Warehouses = "/sale/warehouses",
	Categories = "/sale/categories",
	CategoriesFilters = "/sale/category-filters",
	Products = "/sale/products",
	Product = "/sale/products",
}

export interface SaleProductApi {
	getProduct(id: string | number): Promise<SaleProduct>;
	getProducts(params: {
		page: number;
		limit?: number;
		search?: string;
		filters?: SaleFilters;
		categoryIds?: (string | number)[];
	}): Promise<Pagination<SaleProduct>>;
}

export interface SaleApi extends SaleProductApi {
	getCustomerFilters(): Promise<CustomerFilter[]>;
	getEmployeeFilters(): Promise<EmployeeFilter[]>;
	getWarehouseFilters(): Promise<WarehouseFilter[]>;
	getSaleCategoryFilters(): Promise<SaleCategoryFilter[]>;
	getCategories(): Promise<SaleCategory[]>;
}

export class SaleApiImpl implements SaleApi {
	async getCustomerFilters(): Promise<CustomerFilter[]> {
		const response = await authClient.get<CustomerFilter[]>(SaleApiPath.Customers);
		return response.body ?? [];
	}

	async getEmployeeFilters(): Promise<EmployeeFilter[]> {
		const response = await authClient.get<EmployeeFilter[]>(SaleApiPath.Employees);
		return response.body ?? [];
	}

	async getWarehouseFilters(): Promise<WarehouseFilter[]> {
		const response = await authClient.get<WarehouseFilter[]>(SaleApiPath.Warehouses);
		return response.body ?? [];
	}

	async getSaleCategoryFilters(): Promise<SaleCategoryFilter[]> {
		const response = await authClient.get<SaleCategoryFilter[]>(SaleApiPath.CategoriesFilters);
		return response.body ?? [];
	}

	async getCategories(): Promise<SaleCategory[]> {
		const response = await authClient.get<SaleCategory[]>(SaleApiPath.Categories);
		return response.body ?? [];
	}

	async getProduct(id: string | number): Promise<SaleProduct> {
		const response = await authClient.get<SaleProduct>(`${SaleApiPath.Product}/${id}`);
		return response.body ?? ({} as SaleProduct);
	}

	async getProducts(params: {
		page: number;
		limit?: number;
		search?: string;
		filters?: SaleFilters;
		categoryIds?: (string | number)[];
	}): Promise<Pagination<SaleProduct>> {
		const response = await authClient.get<Pagination<SaleProduct>>(SaleApiPath.Products, {
			queryParameters: {
				page: params.page,
				limit: params.limit ?? 20,
				search: params.search,
				categoryIds: params.categoryIds,
				...params.filters,
			},
		});
		return response.body ?? ({ list: [], total: 0, page: 1, pageSize: 0, pageCount: 0 } as Pagination<SaleProduct>);
	}
}

export default new SaleApiImpl();
