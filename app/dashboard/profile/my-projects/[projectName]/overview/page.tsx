"use client";

import Tabbar from "@/app/_components/Tabbar";
import socket from "@/utils/socket";
import { EmitSocket } from "@/utils/socket/SocketEmit";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getOneContainer } from "@/app/api/container/getOneContainer";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { queueApi } from "@/app/api/api";
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
import Logo from "@/public/logo.png"
import Image from "next/image";
import ThumbnailSection from "@/app/_components/ThumbnailSection";

const page = () => {
  const { projectName } = useParams();
  const { data: session } = useSession();
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
        <Tabbar
          tabs={tabs}
        />
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

          <Logs logs={logs} project={project} />
        </div>
      </div>
    </div>
  );
};

const Logs = ({ logs, project }: { logs: any[], project: any }) => {
  return (
    <div className="w-full max-h-[300px] border rounded-md p-5 flex flex-col justify-start items-start gap-2 bg-white dark:bg-stone-950">
      <p className="text-sm font-semibold">Logs</p>
      <div className="w-full flex-1 overflow-y-scroll flex flex-col-reverse justify-start items-start gap-2">
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
        {(logs.length === 0 && project.status !== "PENDING") && (
          <p className="text-sm text-stone-500 leading-tight mt-1 whitespace-nowrap">
            No logs available
          </p>
        )}
        {(logs.length === 0 && project.status === "PENDING") && (
          <p className="text-sm text-stone-500 leading-tight mt-1 whitespace-nowrap">
            Building...
          </p>
        )}
      </div>
      {project.status === "PENDING" && (
        <Loader size={16} className="animate-spin" />
      )}
    </div>
  );
};

export default page;
