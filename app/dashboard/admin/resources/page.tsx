"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getAllUsersContainers } from "@/app/api/container/getAllUsersContainers";
import { getAllDeployments } from "@/app/api/k8s/getAllDeployments";
import Tabbar from "@/app/_components/Tabbar";

const page = () => {
  const router = useRouter();
  const adminTabs = ["All Repositories", "Resources", "Settings"];
  const [allUsersContainers, setAllUsersContainers] = useState<any[]>([]);
  const { data: session } = useSession();
  const tabs = ['K8s Deployments', 'K8s Services', 'K8s Ingresses']
  const [selectedTab, setSelectedTab] = useState(tabs[0])

  const GetAllUsersContainers = async () => {
    const response = await getAllUsersContainers();
    console.log("allUsersContainers", response);

    if (response.success) {
      setAllUsersContainers(
        response?.message.map((container: any) => container.container)
      );
    } else {
      console.log("Error GetUserContainers", response);
    }
  };

  const GetK8sDeployments = async () => {
    const response = await getAllDeployments();
    console.log("GetK8sDeployments", response);
  }

  // Handle Socket
  useEffect(() => {
    // EmitSocket("joinRoom", "life.au");
    GetAllUsersContainers();
    GetK8sDeployments();
  }, [session]);

  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      <div className="w-full flex flex-col justify-start items-center gap-1 bg-white dark:bg-stone-950 border-b dark:border-stone-700">
        <Tabbar
          tabs={adminTabs}
          numberOfRepositories={allUsersContainers.length.toString()}
        />
      </div>
      <div className="w-full max-w-[1600px] flex-1 flex flex-col justify-start items-center gap-1 bg-transparent pb-10">
        <div className='w-full flex-1 flex flex-col justify-start items-center bg-transparent'>
          <div className='w-full flex justify-center items-center gap-2 bg-white dark:bg-stone-950 border-b dark:border-stone-700'>
            <div className='w-full max-w-[1600px] p-5 py-8 flex justify-start items-center gap-2'>
              <h1 className='pl-2 text-2xl font-semibold text-black dark:text-white text-left'>Life.au • Resources</h1>
            </div>
          </div>

          <div className="w-full max-w-[1600px] h-full flex justify-center items-start bg-transparent">
            <div className="w-full h-full max-w-[15%] hidden md:flex flex-col gap-3 justify-start items-start p-5">
              {tabs.map((tab, index) => {
                return (
                  <p
                    key={index}
                    className={`pl-2 text-base hover:text-opacity-40 duration-300 cursor-pointer ${selectedTab === tab ? "text-black dark:text-white" : "text-stone-400 dark:text-stone-500"}`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab}
                  </p>
                );
              })}
            </div>

            <div className="w-full min-h-full h-fit flex flex-col justify-start items-start p-5 gap-10 border-l-[1px] border-gray-200 dark:border-stone-700">

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default page;
