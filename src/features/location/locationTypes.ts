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
  }
  
  export type AllotLocationType = {
    locations: String[];
    module_description: string;
    module_name:string;
  };
  type UserList = {
    menu_key: string;
    name: string;
    parent_menu_key: string | null;
    url: string | null;
    order: number;
    is_active: number;
    icon: string;
    description: string;
    children?: LocationItemList[]; // Optional because not all menu items may have children
  };

  
  export type AllotLocationListResponse = {
    success: boolean;
    data: LocationItemList[];
    code: number;
    message: string
  };
  
  export type LocationState = {
    createMenuLoading: boolean;
    locationList: LocationItemList[] | null;
    userList: UserList[] | null;
    deleteMenuLoading: boolean;
    disableMenuLoading: boolean;
    isId: any;
    allotLocationList: any;
    loading: boolean;
    allotLocationLoading: boolean

  };
  