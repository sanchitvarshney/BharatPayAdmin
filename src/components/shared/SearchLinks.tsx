import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "react-router-dom";  // Ensure Link is imported from react-router-dom

const menuBarData = [
  {
    id: 2,
    title: "Dashboard",
    icon: "inventoryIcon",
    route: "/",
    subcategories: [
      { id: 2.1, title: "Dashboard", route: "/" },
    ],
  },
  {
    id: 3,
    title: "User",
    icon: "ordersIcon",
    route: "/user",
    subcategories: [
      { id: 3.1, title: "Add New User", route: "/user/add-user" },
      { id: 3.2, title: "View Users", route: "/user/view-user" },
    ],
  },
  {
    id: 4,
    title: "Roles",
    icon: "suppliersIcon",
    route: "/role/list",
    subcategories: [
      { id: 4.1, title: "User Roles", route: "/role/list" },
    ],
  },
  {
    id: 5,
    title: "Location",
    icon: "customersIcon",
    route: "/location/list",
    subcategories: [
      { id: 5.1, title: "Allot Location", route: "/location/list" },
      { id: 5.2, title: "Location Alloted Module", route: "/location/alloted-location" },
    ],
  },
  {
    id: 6,
    title: "Menu",
    icon: "reportsIcon",
    route: "/menu/create",
    subcategories: [
      { id: 6.1, title: "Create Master Menu", route: "menu/create" },
      { id: 6.2, title: "Menu List", route: "/menu/list" },
    ],
  },
  {
    id: 7,
    title: "Permissions",
    icon: "settingsIcon",
    route: "/permission/list",
    subcategories: [
      { id: 7.1, title: "Permission List", route: "/permission/list" },
    ],
  },
  {
    id: 7,
    title: "Notifications",
    icon: "settingsIcon",
    route: "/notification",
    subcategories: [
      { id: 7.1, title: "List of Notifications", route: "/notification" },
    ],
  },
  {
    id: 7,
    title: "Profile",
    icon: "settingsIcon",
    route: "/profile",
    subcategories: [
      { id: 7.1, title: "Profile", route: "/profile" },
    ],
  },
];

const SearchLinks: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [menu, setMenu] = useState<any[] | null>([]);

  useEffect(() => {
    if (input) {
      setOpen(true);
      setMenu(
        menuBarData.filter(
          (item) =>
            item.title.toLowerCase().includes(input.toLowerCase()) ||
            item.subcategories.some((sub) => sub.title.toLowerCase().includes(input.toLowerCase()))
        )
      );
    } else {
      setOpen(false);
    }
  }, [input]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger onClick={(e) => e.preventDefault()}>
          <div className="relative flex items-center text-slate-600 ">
            <Input
              className="bg-gray-200 w-[500px] text-[13px] focus-visible:bg-white focus-visible:shadow-zinc-400"
              placeholder="Search"
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <FiSearch className="absolute right-[8px] h-[20px] w-[20px] text-blue-600" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[500px] p-0 overflow-hidden rounded"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {menu &&
            menu.map((item) => (
              <div key={item.id} className="grid grid-cols-[150px_1fr] border-b border-slate-300">
                <div className="bg-blue-100 border-e border-slate-300 p-[10px] text-[13px]">
                  {item.title}
                </div>
                <div className="py-[10px]">
                  {item.subcategories.map((sub: any) => (
                    <div key={sub.id} className="w-full">
                      <Link
                        to={sub.route}  // Navigate to the route associated with this subcategory
                        className="py-[5px] px-[10px] hover:text-blue-600 w-full text-slate-500 text-[13px]"
                      >
                        {sub.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </PopoverContent>
      </Popover>
    </>
  );
};

export default SearchLinks;
