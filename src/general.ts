export const findMenuKey = (url: string, menuList: any): string | null => {
  if (Array.isArray(menuList)) {
    for (let menu of menuList) {
      // Check if the top-level menu itself has the URL
      if (menu.url === url) {
        return menu.menu_key;
      }
      // Check if the menu has children
      if (Array.isArray(menu.children)) {
        for (let child of menu.children) {
          // Check if the child URL matches
          if (child.url === url) {
            return child.menu_key;
          }
        }
      }
    }
  }
  return null;
};
