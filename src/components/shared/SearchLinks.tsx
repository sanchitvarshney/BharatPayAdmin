import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "react-router-dom";
const menuBarData = [
  {
    id: 2,
    title: "Inventory",
    icon: "inventoryIcon",
    route: "/inventory",
    subcategories: [
      { id: 2.1, title: "Stock Management", route: "/inventory/stock-management" },
      { id: 2.2, title: "Product Categories", route: "/inventory/product-categories" },
      { id: 2.3, title: "Add New Product", route: "/inventory/add-product" },
    ],
  },
  {
    id: 3,
    title: "Orders",
    icon: "ordersIcon",
    route: "/orders",
    subcategories: [
      { id: 3.1, title: "Purchase Orders", route: "/orders/purchase" },
      { id: 3.2, title: "Sales Orders", route: "/orders/sales" },
      { id: 3.3, title: "Returns", route: "/orders/returns" },
    ],
  },
  {
    id: 4,
    title: "Suppliers",
    icon: "suppliersIcon",
    route: "/suppliers",
    subcategories: [
      { id: 4.1, title: "Supplier List", route: "/suppliers/list" },
      { id: 4.2, title: "Add New Supplier", route: "/suppliers/add" },
    ],
  },
  {
    id: 5,
    title: "Customers",
    icon: "customersIcon",
    route: "/customers",
    subcategories: [
      { id: 5.1, title: "Customer List", route: "/customers/list" },
      { id: 5.2, title: "Add New Customer", route: "/customers/add" },
    ],
  },
  {
    id: 6,
    title: "Reports",
    icon: "reportsIcon",
    route: "/reports",
    subcategories: [
      { id: 6.1, title: "Inventory Reports", route: "/reports/inventory" },
      { id: 6.2, title: "Sales Reports", route: "/reports/sales" },
    ],
  },
  {
    id: 7,
    title: "Settings",
    icon: "settingsIcon",
    route: "/settings",
    subcategories: [
      { id: 7.1, title: "Profile Settings", route: "/settings/profile" },
      { id: 7.2, title: "System Settings", route: "/settings/system" },
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
            item.title.toLowerCase().includes(input.toLowerCase()) || item.subcategories.some((sub) => sub.title.toLowerCase().includes(input.toLowerCase()))
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
        <PopoverContent className="w-[500px] p-0 overflow-hidden rounded " onOpenAutoFocus={(e) => e.preventDefault()} onCloseAutoFocus={(e) => e.preventDefault()}>
          {menu &&
            menu.map((item) => (
              <div className="grid grid-cols-[150px_1fr] border-b border-slate-300">
                <div className="bg-blue-100 border-e border-slate-300 p-[10px] text-[13px]">{item.title}</div>
                <div className="py-[10px]">
                  {item.subcategories.map((sub: any) => (
                    <div className="w-full">
                      <Link to={"#"} className=" py-[5px] px-[10px] hover:text-blue-600 w-full text-slate-500 text-[13px]">
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
