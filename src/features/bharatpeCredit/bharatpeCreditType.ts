export type BharatpeCreditState = {
  createBharatpeCreditLoading: boolean;
  bharatpeCreditListLoading: boolean;
  bharatpeCreditList: BharatpeCreditListItem[] | null;
  updateBharatpeCreditLoading: boolean;
  deleteBharatpeCreditLoading: boolean;
};

export type BharatpeCreditListItem = {
  key: string;
  show: string;
  show_component: string;
  calc_component_key: string;
  calc_component: string;
  type: string;
  created_by?: string;
  show_component_key?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
  date?: string;
};

export type CreateBharatpeCreditResponse = {
  success: boolean;
  message: string;
};

export type BharatpeCreditListResponse = {
  success: boolean;
  data: BharatpeCreditListItem[];
};
