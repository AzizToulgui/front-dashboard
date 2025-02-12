import React from "react";
import { AccountToggle } from "./AccountToggle";
import { Search } from "./Search";
import { RouteSelect } from "./RouteSelect";
import { Plan } from "./Plan";

export const Sidebar = () => {
  return (
    <div>
      <div className="shadow-md sticky top-4 h-[calc(100vh-32px-48px)] p-4 rounded-lg">
        <AccountToggle />
        <RouteSelect />
      </div>

        {/* <Plan /> */}
    </div>
  );
};
