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
import { Input } from "@/components/ui/input";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [confirmedProjectName, setConfirmedProjectName] = useState<string>("");
  const [deployedLink, setDeployedLink] = useState<string>("");

  const GetOneContainer = async () => {
    const response = await getOneContainer({
      name: projectName?.toString().split("--of-")[0],
    });
    if (response.success) {
      setProject(response.message);
    } else {
      console.log(response.message, "response.message");
    }
  };

  const DeleteContainer = async () => {
    const response = await deleteContainer({
      name: projectName?.toString().split("--of-")[0],
    });
    if (response.success) {
      router.push("/dashboard");
    } else {
      console.log(response.message, "response.message");
    }
  };

  const handleBuild = async () => {
    setLoading(true);
    setMessage(
      "It may take a few minutes to deploy your project. Please wait..."
    );
    if (!project?.githubUrl && !session?.lifeAuUser._id) {
      window.alert("Error: Please wait");
      return "Error: Missing required fields";
    }
    const response = await fetch(`${queueApi}/build`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        githubUrl: project?.githubUrl,
        userId: session?.lifeAuUser._id,
      }),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.log("Error:", error);
      });

    if (response.success) {
      console.log(response);
      setMessage("Building in Process. Please wait...");
    } else {
      console.error(response);
    }
    setTimeout(() => {
      setLoading(false);
      GetOneContainer();
    }, 1000);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleDelete = async () => {
    DeleteContainer();
  };

  const handleK8Deploy = async () => {
    if (project?.name !== confirmedProjectName) {
      setMessage("Project name does not match. Please try again.");
      return;
    }
    const projectName = project?.name.split(".").join("-");
    setLoading(true);
    setMessage(
      "It may take a few minutes to deploy your project. Please wait..."
    );
    if (!project?.githubUrl && !session?.lifeAuUser._id) {
      window.alert("Error: Please wait");
      return "Error: Missing required fields";
    }
    const response = await fetch(`${k8Api}/initialize`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName,
        image: "u6511923/" + project?.name,
        port: 3000,
      }),
    }).then((res) => res.json());

    if (response.success) {
      console.log(response);
      let res = `Kubernetes Deployment Successfull! 🚀 App link => http://${project?.name}.life-au.live`;
      let link = res.split("=>")[1].trim();
      setDeployedLink(link);
      setMessage("Your project has been deployed successfully!");
    } else {
      console.log(response);
      setMessage("Error: Deployment failed. Please try again.");
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
        <Tabbar
          tabs={adminTabs}
          numberOfRepositories={path.split("--of-")[1]}
        />
      </div>

      <div className="w-full flex-1 flex flex-col justify-start items-center pb-10 gap-5">
        <div className="w-full flex-1 flex flex-col justify-start items-center pb-10 gap-5">
          <div className="w-full flex justify-center items-start gap-2 bg-white dark:bg-stone-950 border-b dark:border-stone-700">
            <div className="w-full max-w-[1600px] p-5 py-8 flex justify-start items-center gap-2">
              <h1 className="pl-2 text-2xl font-semibold text-black dark:text-white text-left">
                {projectName?.toString().split("--of-")[0]} • {selectedTab.name}
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
                    <AlertDialogTitle>⚠️ Logout Alert!</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to logout. You will be redirected to
                      the landing page.
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
