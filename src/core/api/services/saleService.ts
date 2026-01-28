import { SaleCategory } from "@/core/domain/sales/entities/sale-category";
import type { SaleProduct } from "@/core/domain/sales/entities/sale-product";
import type {
	CustomerFilter,
	EmployeeFilter,
	WarehouseFilter,
	SaleCategoryFilter,
} from "@/core/domain/sales/entities/sale-filter";
import type { SaleFilters } from "@/core/domain/sales/entities/sale-filter";
import type { Pagination } from "@/core/types/pagination";
import { apiClient } from "../apiClient";

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
		const response = await apiClient.get<CustomerFilter[]>({
			url: SaleApiPath.Customers,
		});
		return response;
	}

	async getEmployeeFilters(): Promise<EmployeeFilter[]> {
		const response = await apiClient.get<EmployeeFilter[]>({
			url: SaleApiPath.Employees,
		});
		return response;
	}

	async getWarehouseFilters(): Promise<WarehouseFilter[]> {
		const response = await apiClient.get<WarehouseFilter[]>({
			url: SaleApiPath.Warehouses,
		});
		return response;
	}

	async getSaleCategoryFilters(): Promise<SaleCategoryFilter[]> {
		const response = await apiClient.get<SaleCategoryFilter[]>({
			url: SaleApiPath.CategoriesFilters,
		});
		return response;
	}

	async getCategories(): Promise<SaleCategory[]> {
		const response = await apiClient.get<SaleCategory[]>({
			url: SaleApiPath.Categories,
		});
		return response;
	}

	async getProduct(id: string | number): Promise<SaleProduct> {
		const response = await apiClient.get<SaleProduct>({
			url: `${SaleApiPath.Product}/${id}`,
		});
		return response;
	}

	async getProducts(params: {
		page: number;
		limit?: number;
		search?: string;
		filters?: SaleFilters;
		categoryIds?: (string | number)[];
	}): Promise<Pagination<SaleProduct>> {
		const response = await apiClient.get<Pagination<SaleProduct>>({
			url: SaleApiPath.Products,
			params: {
				page: params.page,
				limit: params.limit ?? 20,
				search: params.search,
				categoryIds: params.categoryIds,
				...params.filters,
			},
		});
		return response;
	}
}

export default new SaleApiImpl();
