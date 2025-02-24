"use client";

import Tabbar from "@/app/_components/Tabbar";
import socket from "@/utils/socket";
import { EmitSocket } from "@/utils/socket/SocketEmit";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getOneContainer } from "@/app/api/container/getOneContainer";
import { deleteContainer } from "@/app/api/container/deleteContainer";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { api, k8Api, queueApi } from "@/app/api/api";
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
import { updateContainer } from "@/app/api/container/updateContainer";

const page = () => {
  const { projectName } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const path = usePathname();
  const adminTabs = [
    {
      name: "All Repositories",
      link: "/dashboard/admin/all-repositories",
    },
    {
      name: "Overview",
      link: `/dashboard/admin/all-repositories/${projectName}/overview`
    },
    {
      name: "Settings",
      link: `/dashboard/admin/all-repositories/${projectName}/settings`,
    }
  ];
  const [selectedTab, setSelectedTab] = React.useState(adminTabs[1]);
  const [logs, setLogs] = useState<any[]>([]);
  const [project, setProject] = useState<any>({});
  const [message, setMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

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
      router.push(`/dashboard/admin/all-repositories`);
    } else {
      console.log(response.message, "response.message");
    }
  };

  const UpdateContainer = async (container: any) => {
    const response = await updateContainer({ container})
    if(response.success) {
      console.log(response);
      GetOneContainer();
    } else {
      console.log(response.message, "response.message");
    }
  }

  const handleDelete = async () => {
    DeleteContainer();
  };

  const handleK8sDown = async () => {
    const response = await fetch(`${k8Api}/down`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName?.toString().replace(".", "-"),
      }),
    }).then((res) => res.json())
    .catch((error) => {
      console.log('Error:', error);
    });
    if(response.success) {
      console.log(response);
      setMessage("Your K8s service has been stopped successfully!");
      UpdateContainer({
        ...project,
        status: "READY",
        deployedURL: "",
      });
    } else {
      console.log(response);
      setErrorMessage("Failed to stop K8s service. Please try again. Or the service may have already been stopped.");
    }
  }

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
        <Tabbar
          tabs={adminTabs}
        />
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
            <div className="w-full p-5 bg-white dark:bg-stone-950 rounded-md bdr cursor-pointer duration-300 flex flex-col justify-start items-start gap-5">
              <p className="text-lg font-medium text-red-400">Danger Zone</p>
              <div className="w-full flex flex-col justify-start items-start gap-2">
                <p className="text-sm text-stone-400 dark:text-stone-500">
                  You can stop your K8s deployment here.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="p-2 border-[1px] border-red-500 rounded-md text-red-500 hover:bg-red-500 hover:text-white bg-transparent h-8 flex justify-center items-center">
                      <p className="text-sm whitespace-nowrap">
                        Stop
                      </p>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>⚠️ K8s Service Stopping Alert!</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to stop your service? The current project Link will be disabled.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="h-8">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className='className="p-2 bg-red-500 dark:bg-red-200 h-8 rounded-md flex justify-center items-center"'
                        onClick={() => {
                          handleK8sDown();
                        }}
                      >
                        Stop
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {message && <p className="text-sm text-gray-400">{message}</p>}
                {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
              </div>
              <div className="w-full h-[1px] bg-stone-300 dark:bg-stone-700"></div>
              <div className="w-full flex flex-col justify-start items-start gap-2">
                <p className="text-sm text-stone-400 dark:text-stone-500">
                  Be careful with this section. The actions are irreversible.
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
    </div>
  );
};

export default page;
