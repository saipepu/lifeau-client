"use client";

import Tabbar from "@/app/_components/Tabbar";
import socket from "@/utils/socket";
import { EmitSocket } from "@/utils/socket/SocketEmit";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getOneContainer } from "@/app/api/container/getOneContainer";
import { deleteContainer } from "@/app/api/container/deleteContainer";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { k8Api, queueApi } from "@/app/api/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const page = () => {
  const { projectName } = useParams();
  const router = useRouter();
  const path = usePathname();
  const tabs = [
    {
      name: "My Projects",
      link: "/dashboard/profile/my-projects",
    },
    {
      name: "Overview",
      link: `/dashboard/profile/my-projects/${projectName}/overview`,
    },
    {
      name: "Settings",
      link: `/dashboard/profile/my-projects/${projectName}/settings`,
    },
  ];
  const [selectedTab, setSelectedTab] = React.useState(tabs[1]);
  const [logs, setLogs] = useState<any[]>([]);
  const [project, setProject] = useState<any>({});

  const GetOneContainer = async () => {
    const response = await getOneContainer({
      name: projectName?.toString(),
    });
    if (response.success) {
      setProject(response.message);
    } else {
      console.log(response.message, "response.message");
    }
  };

  const DeleteContainer = async () => {
    const response = await deleteContainer({
      name: projectName?.toString(),
    });
    if (response.success) {
      router.push("/dashboard/profile/my-projects");
    } else {
      console.log(response.message, "response.message");
    }
  };

  const handleDelete = async () => {
    DeleteContainer();
  };

  useEffect(() => {
    EmitSocket("joinRoom", "life.au");
    GetOneContainer();
  }, []);

  socket.on("log", (log) => {
    let logList = logs.map((log) => log.message);
    if (!logList.includes(log)) {
      setLogs([
        {
          message: log,
          timestamp: new Date(),
        },
        ...logs,
      ]);
    }
  });
  socket.on("connectedDevices", (devices) => {
    console.log(devices, "connectedDevices");
  });

  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      <div className="w-full flex flex-col justify-start items-center gap-1 bg-white dark:bg-stone-950 border-b dark:border-stone-700">
        <Tabbar tabs={tabs} />
      </div>

      <div className="w-full flex-1 flex flex-col justify-start items-center pb-10 gap-5">
        <div className="w-full flex-1 flex flex-col justify-start items-center pb-10 gap-5">
          <div className="w-full flex justify-center items-start gap-2 bg-white dark:bg-stone-950 border-b dark:border-stone-700">
            <div className="w-full max-w-[1600px] p-5 py-8 flex justify-start items-center gap-2">
              <h1 className="pl-2 text-2xl font-semibold text-black dark:text-white text-left">
                {projectName?.toString()} • {selectedTab.name}
              </h1>
            </div>
          </div>
          <div className="w-full max-w-[1600px] p-5 flex flex-col justify-start items-start gap-2">
            {/* danger zone */}
            <div className="w-full p-5 bg-white dark:bg-stone-950 rounded-md bdr cursor-pointer duration-300 flex flex-col justify-start items-start gap-2">
              <p className="text-lg font-medium text-red-400">Danger Zone</p>
              <p className="text-sm text-stone-400 dark:text-stone-500">
                Be careful with this section. The action are irreversible.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="p-2 bg-red-500 h-8 rounded-md flex justify-center items-center">
                    <p className="text-sm text-white whitespace-nowrap">
                      Delete
                    </p>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>⚠️ Project Deletion Alert!</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete your project?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="h-8">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className='className="p-2 bg-red-500 dark:bg-red-200 h-8 rounded-md flex justify-center items-center"'
                      onClick={() => {
                        handleDelete();
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
