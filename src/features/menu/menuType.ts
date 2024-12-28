export type CreateMenuType = {
  project: string;
  name: string;
  isParent: boolean;
  parent_menu_key: string;
  url: any;
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

type MenuItemList = {
  menu_key: string;
  name: string;
  parent_menu_key: string | null;
  url: string | null;
  order: number;
  is_active: number;
  icon: string;
  description: string;
  children?: MenuItemList[]; // Optional because not all menu items may have children
  project_name: string;
  hasTab: boolean;
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
  children?: MenuItemList[]; // Optional because not all menu items may have children
};

export type MenuListResponse = {
  success: boolean;
  menu: MenuItemList[];
  code: number;
};

export type MenuState = {
  createMenuLoading: boolean;
  menuListLoading: boolean;
  menuList: MenuItemList[] | null;
  userList: UserList[] | null;
  deleteMenuLoading: boolean;
  disableMenuLoading: boolean;
  isId: any;
  menuTabList: any;
  addTabLoading: boolean;
  permissionMenu: any;
  adminMenuList: any;
};
