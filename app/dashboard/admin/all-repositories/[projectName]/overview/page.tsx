"use client";

import Tabbar from "@/app/_components/Tabbar";
import socket from "@/utils/socket";
import { EmitSocket } from "@/utils/socket/SocketEmit";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getOneContainer } from "@/app/api/container/getOneContainer";
import { deleteContainer } from "@/app/api/container/deleteContainer";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Globe, Loader } from "lucide-react";
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
import Logo from "@/public/logo.png";
import Image from "next/image";
import ThumbnailSection from "@/app/_components/ThumbnailSection";
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
      link: `/dashboard/admin/all-repositories/${projectName}/overview`,
    },
    {
      name: "Settings",
      link: `/dashboard/admin/all-repositories/${projectName}/settings`,
    },
  ];
  const [logs, setLogs] = useState<any[]>([]);
  const [project, setProject] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

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

  const UpdateContainer = async (container: any) => {
    const response = await updateContainer({ container });
    if (response.success) {
      console.log(response);
      GetOneContainer();
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
        <Tabbar tabs={adminTabs} />
      </div>

      <div className="w-full flex-1 flex flex-col justify-start items-center pb-10 gap-5">
        <div className="w-full flex justify-center items-start gap-2 bg-white dark:bg-stone-950 border-b dark:border-stone-700">
          <div className="w-full max-w-[1600px] p-5 py-8 flex justify-start items-center gap-2">
            <h1 className="pl-2 text-2xl font-semibold text-black dark:text-white text-left">
              {projectName?.toString()} • Overview
            </h1>
            <div
              className={`
                font-semibold p-1 px-2 text-xs rounded-full mr-auto h-full flex justify-center items-center
                ${
                  project?.status === "READY" &&
                  "text-green-500 bg-green-200 dark:opacity-90"
                }
                ${
                  project?.status === "PENDING" &&
                  "text-yellow-500 bg-yellow-200 dark:opacity-90"
                }
                ${
                  project?.status === "FAILED" &&
                  "text-red-500 bg-red-200 dark:opacity-90"
                }
                ${
                  project?.status === "DEPLOYED" &&
                  "text-purple-500 bg-purple-200 dark:opacity-90"
                }
                `}
            >
              {project?.status}
            </div>
            {project.status === "FAILED" && (
              <p className="text-sm text-red-500">{project?.failedReason}</p>
            )}
            <div className="flex justify-end items-center gap-2">
              {session?.lifeAuUser?.mode !== "admin" && (
                <Button
                  className="p-2 bg-black dark:bg-white h-8 rounded-md flex justify-center items-center"
                  onClick={() => handleBuild()}
                >
                  <p className="text-sm text-white dark:text-black whitespace-nowrap">
                    {loading ? (
                      <Loader size={20} className="animate-spin" />
                    ) : (
                      "Redeploy"
                    )}
                  </p>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1600px] p-5 flex flex-col justify-start items-start gap-5">
          <ThumbnailSection project={project} Logo={Logo} />

          <Logs logs={logs} />

          <Deployment project={project} UpdateContainer={UpdateContainer} />
        </div>
      </div>
    </div>
  );
};

const Logs = ({ logs }: { logs: any[] }) => {
  return (
    <div className="w-full max-h-[300px] border rounded-md p-5 flex flex-col justify-start items-start gap-2 bg-white dark:bg-stone-950">
      <p className="text-sm font-semibold">Logs</p>
      <div className="w-full overflow-y-scroll flex flex-col-reverse justify-start items-start gap-2">
        {logs.map((log, index) => (
          <div
            className="w-full flex justify-start items-start gap-2"
            key={index}
          >
            <p className="text-sm font-medium whitespace-nowrap min-w-[90px] w-fit">
              {log.timestamp.toLocaleTimeString()}
            </p>
            <p className="text-sm leading-tight">{log.message}</p>
          </div>
        ))}
        {logs.length === 0 && (
          <p className="text-sm text-stone-500 leading-tight mt-1 whitespace-nowrap">
            No logs available
          </p>
        )}
      </div>
    </div>
  );
};

const Deployment = ({
  project,
  UpdateContainer,
}: {
  project: any;
  UpdateContainer: (x: any) => void;
}) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [confirmedProjectName, setConfirmedProjectName] = useState<string>("");
  const [deployedLink, setDeployedLink] = useState<string>("");
  const [port, setPort] = useState<number>(3000);

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
        port: port,
      }),
    }).then((res) => res.json());

    if (response.success) {
      console.log(response);
      let res = `Kubernetes Deployment Successfull! 🚀 App link => http://${project?.name}.life-au.live`;
      let link = res.split("=>")[1].trim();
      setDeployedLink(link);

      UpdateContainer({
        ...project,
        status: "DEPLOYED",
        deployedURL: `https://${project?.name.replace(".","-")}.life-au.live`
      });

      setMessage("Your project has been deployed successfully!");
    } else {
      console.log(response);
      setMessage("Error: Deployment failed. Please try again. or the service may have already been deployed.");
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full flex flex-col justify-start items-start gap-2">
      <p className="text-2xl text-purple-500 font-semibold">K8s Deployment</p>
      <div className="w-full p-5 bg-white dark:bg-stone-950 rounded-md bdr cursor-pointer duration-300 flex flex-col justify-start items-start gap-2">
        <p className="text-lg font-medium text-purple-500">
          Deploy to life-au.live Cluster
        </p>
        <div className="w-full flex flex-col justify-start items-start gap-2">
          <p className="text-sm text-stone-400 dark:text-stone-500">
            Please type in the project name{" "}
            <span className="font-semibold">{project?.name}</span> to confirm
            the deployment.
          </p>
          <Input
            onChangeCapture={(e: any) =>
              setConfirmedProjectName(e.target.value)
            }
            className="disabled:opacity-80 placeholder:text-gray-300"
            placeholder={`${project?.name}`}
          />
          <p className="text-sm text-stone-400 dark:text-stone-500">
            Please type in the target port number for your app.
          </p>
          <Input
            onChangeCapture={(e: any) => setPort(Number(e.target.value))}
            placeholder="Target Port Number (Default 3000)"
            className="disabled:opacity-80 placeholder:text-gray-300"
          />
          <Button
            className="p-2 h-full bg-black dark:bg-white rounded-md flex justify-center items-center"
            onClick={() => handleK8Deploy()}
          >
            <p className="text-sm text-white dark:text-black whitespace-nowrap">
              {loading ? (
                <Loader size={20} className="animate-spin" />
              ) : project?.status === "DEPLOYED" ? (
                "Redeploy"
              ) : (
                "Deploy"
              )}
            </p>
          </Button>
        </div>
        <p className="text-sm text-neutral-500">{message}</p>
        {deployedLink && (
          <div className="p-2 px-4 text-xs rounded-lg mr-auto h-full flex justify-center items-center text-green-500 bg-green-200 dark:opacity-90">
            <p className="text-sm text-green-500">
              Whiplash 🔥 Your app is now live on{" "}
            </p>
            <a href={deployedLink} target="_blank" className="pl-2 text-black">
              {deployedLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
