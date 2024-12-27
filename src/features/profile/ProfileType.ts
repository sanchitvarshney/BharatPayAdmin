export type CreateMenuType = {
  project: string;
  name: string;
  isParent: boolean;
  parent_menu_key: string;
  url: string;
  description: string;
  icon: string;
  order: string;
  is_active: boolean;
  has_parent: boolean;
};

export type AddTabType = {
  menuId: string;
  name: string;
  url: string;
  icon: string;
  order: string;
  description: string;
  status: string;
};
export type CreateMenuResponse = {
  success: boolean;
  message: string;
};

export type LocationListResponse = {
  success: boolean;
  data: LocationItemList[];
  code: number;
};

type LocationItemList = {
  name: string;
  code: string;
};

export type AllotLocationType = {
  locations: String[];
  module_description: string;
  module_name: string;
};

export type AllotLocationListResponse = {
  success: boolean;
  data: LocationItemList[];
  code: number;
  message: string;
};

export type ProfileResponse = {
  success: boolean;
  data: Profile[];
  code: number;
};
type Profile = {
  email: string;
  user_name: string;
  type: string | null;
  status: string | null;
  mobile: number;
  id: number;
  gender: string;
};

export type ProfileState = {
  createMenuLoading: boolean;
  locationList: LocationItemList[] | null;
  profile: Profile[] | null;
  deleteMenuLoading: boolean;
  disableMenuLoading: boolean;
  isId: any;
  allotLocationList: any;
  loading: boolean;
  allotLocationLoading: boolean;
};
