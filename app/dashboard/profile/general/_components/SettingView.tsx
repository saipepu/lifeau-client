
import { useSession } from "next-auth/react";
import React from "react";
import GeneralSetting from "./GeneralSetting";
import AccountSetting from "./AccountSetting";

const SettingView = () => {
  const [tabs, setTabs] = React.useState<string[]>(["All", "General", "Account"]);
  const [selectedTab, setSelectedTab] = React.useState<string>("All");
  const { data: session } = useSession();

  return (
    <div className="w-full flex-1 flex flex-col justify-start items-center bg-transparent">
      <div className='w-full flex justify-center items-center gap-2 bg-white dark:bg-stone-950 border-b dark:border-stone-700'>
        <div className='w-full max-w-[1600px] p-5 py-8 flex justify-start items-center gap-2'>
          <h1 className='pl-2 text-2xl font-semibold text-black dark:text-white text-left'>{session?.lifeAuUser?.name} • Setting</h1>
        </div>
      </div>

      <div className="w-full max-w-[1600px] h-full flex justify-center items-start bg-transparent">
        <div className="w-full h-full max-w-[15%] hidden md:flex flex-col gap-5 justify-start items-start p-5">
          {tabs.map((tab, index) => {
            return (
              <p
                key={index}
                className={`pl-2 text-lg hover:scale-105 duration-300 cursor-pointer ${selectedTab === tab ? "text-black dark:text-white" : "text-stone-400 dark:text-stone-500"}`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </p>
            );
          })}
        </div>

        <div className="w-full min-h-full h-fit flex flex-col justify-start items-start p-5 gap-10 border-l-[1px] border-gray-200 dark:border-stone-700">

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
    </div>
  );
};

export default SettingView;
