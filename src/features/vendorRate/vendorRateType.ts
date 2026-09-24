export type VendorPricingEntry = {
  vendor: string;
  component: string;
  rate: number;
};

export type VendorPricingListItem = {
  sr_no: number;
  pricing_key: string;
  vendor: {
    vendor_id: string;
    vendor_name: string;
  };
  component: {
    component_key: string;
    part_code: string;
    component_name: string;
  };
  rate: number;
  currency: string;
  insert_date: string;
  inserted_by: string;
};

export type VendorPricingUpdateEntry = {
  pricing_key: string;
  rate: number;
};

export type VendorPricingPagination = {
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
};

export type VendorPricingListResponse = {
  success: boolean;
  message: string;
  data: VendorPricingListItem[];
  pagination: VendorPricingPagination;
};

export type VendorRateState = {
  createVendorRateLoading: boolean;
  vendorPricingListLoading: boolean;
  vendorPricingList: VendorPricingListItem[] | null;
  updateVendorPricingLoading: boolean;
};
