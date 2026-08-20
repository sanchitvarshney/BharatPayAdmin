export type MasterRateState = {
  createMasterRateLoading: boolean;
  masterRateListLoading: boolean;
  masterRateList: any;
  masterRateDetailLoading: boolean;
  updateMasterRateLoading: boolean;
};

export type MasterRateEntry = {
  rate_id?: number;
  count_from: number;
  count_to: number;
  rate: number;
};

export type CreateMasterRateType = {
  device_type: string;
  product_sku: string;
  entries: MasterRateEntry[];
};

export type UpdateMasterRateType = CreateMasterRateType;

export type CreateMasterRateResponse = {
  success: boolean;
  message: string;
};

export type MasterRateEntryItem = {
  rateId: number;
  rateCode: string;
  minCount: number;
  maxCount: number;
  amount: string;
  activeStatus: string;
  createdUser: string;
  createdDate: string;
  updatedUser: string | null;
  updatedDate: string | null;
};

export type MasterRateProductGroup = {
  productKey: string;
  productName: string;
  productSkuCode: string;
  productModelName: string | null;
  entries: MasterRateEntryItem[];
};

export type MasterRateDeviceGroup = {
  deviceType: string;
  products: MasterRateProductGroup[];
};

export type MasterRateListResponse = {
  success: boolean;
  data: MasterRateDeviceGroup[];
};

export type MasterRateDetailResponse = {
  success: boolean;
  data: MasterRateDeviceGroup[];
};
