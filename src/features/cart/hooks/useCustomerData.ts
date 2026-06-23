import { CUSTOMER_DATA_STORAGE_KEY } from "../consts";
import type { CustomerData } from "../types";

export function loadCustomerData(): CustomerData | null {
    try {
        const raw = localStorage.getItem(CUSTOMER_DATA_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as CustomerData;
    } catch {
        return null;
    }
}

export function saveCustomerData(data: CustomerData): void {
    localStorage.setItem(CUSTOMER_DATA_STORAGE_KEY, JSON.stringify(data));
}
