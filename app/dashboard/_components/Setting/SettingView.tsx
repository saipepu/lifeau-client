import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import React from "react";
import GeneralSetting from "./GeneralSetting";
import AccountSetting from "./AccountSetting";

const SettingView = () => {
  const [tabs, setTabs] = React.useState<string[]>(["All", "General", "Account"]);
  const [selectedTab, setSelectedTab] = React.useState<string>("All");

  return (
    <div className="w-full max-w-[1500px] flex-1 flex justify-start items-start gap-1 bg-transparent pb-10">
      <div className="w-full h-full max-w-[25%] hidden md:flex flex-col gap-5 justify-start items-start p-5">
        {tabs.map((tab, index) => {
          return (
            <p
              key={index}
              className={`text-lg hover:scale-105 duration-300 cursor-pointer ${selectedTab === tab ? "text-black dark:text-white" : "text-stone-400 dark:text-stone-500"}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </p>
          );
        })}
      </div>

      <div className="w-full flex flex-col justify-start items-start p-5 gap-10">

        {(selectedTab === "General" || selectedTab === "All") && (
          <GeneralSetting />
        )}

        {(selectedTab === "All") && (
          <div className="w-full h-[1px] bg-stone-200 dark:bg-stone-800"></div>
        )}

        {(selectedTab === "Account" || selectedTab === "All") && (
          <AccountSetting />
        )}

      </div>
    </div>
  );
};

export default SettingView;
