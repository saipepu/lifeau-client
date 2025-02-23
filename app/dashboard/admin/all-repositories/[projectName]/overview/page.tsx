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
import Logo from "@/public/logo.png"
import Image from "next/image";

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
          tabs={adminTabs}
          numberOfRepositories={path.split("--of-")[1]}
        />
      </div>

      <div className="w-full flex-1 flex flex-col justify-start items-center pb-10 gap-5">
        <div className="w-full flex justify-center items-start gap-2 bg-white dark:bg-stone-950 border-b dark:border-stone-700">
          <div className="w-full max-w-[1600px] p-5 py-8 flex justify-start items-center gap-2">
            <h1 className="pl-2 text-2xl font-semibold text-black dark:text-white text-left">
              {projectName?.toString().split("--of-")[0]} • Overview
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

          <Logs logs={logs} />

          <Deployment project={project} />
        </div>
      </div>
    </div>
  );
};

const ThumbnailSection = ({
  project,
  Logo
}: {
  project: any,
  Logo: any
}) => {
  const [imageUrl, setImageUrl] = useState<string>("");

  const takeScreenshot = async ({ url }: { url: string}) => {
    const res = await fetch("/api/screenshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    if (data.url) {
      setImageUrl(data.url);
    }
  };
  useEffect(() => {
    if(project?.name) {
      takeScreenshot({ url: `https://${project.name.replace(".","-")}.life-au.live` });
    }
  }, [project]);

  console.log(project);

  return (
    <div className="w-full border rounded-md p-5 flex flex-col justify-start items-start gap-2 bg-white dark:bg-stone-950">
      <p className="text-sm font-semibold">Thumbnail</p>
      <div className="w-full flex flex-col md:flex-row justify-start items-start gap-2 md:gap-5">
        <div className="w-full h-[180px] md:w-[500px] md:h-[300px] flex justify-center items-center border-[1px] rounded-lg border-gray-200 dark:border-stone-700">
          {imageUrl ? (
            <Image
              src={`${imageUrl}?t=${new Date().getTime()}`}
              alt="thumbnail"
              width={500}
              height={500}
              className="rounded-md object-cover w-full h-full"
            />
          ) : (
            <p className="text-sm text-stone-500 dark:text-stone-400">
              No thumbnail available
            </p>
          )}
        </div>
        <div className="w-full flex-1 flex flex-col justify-start items-start gap-2">
          <p className="text-lg font-medium">{project.name}</p>
          <div className="w-fit p-1 px-2 rounded-full flex justify-center items-center gap-1 bg-stone-100 dark:bg-stone-800">
            <div className="w-4 h-4 rounded-full flex justify-center items-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1257_402)">
                <path d="M10 0C8.68678 0 7.38642 0.258658 6.17317 0.761205C4.95991 1.26375 3.85752 2.00035 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 14.42 2.87 18.17 6.84 19.5C7.34 19.58 7.5 19.27 7.5 19V17.31C4.73 17.91 4.14 15.97 4.14 15.97C3.68 14.81 3.03 14.5 3.03 14.5C2.12 13.88 3.1 13.9 3.1 13.9C4.1 13.97 4.63 14.93 4.63 14.93C5.5 16.45 6.97 16 7.54 15.76C7.63 15.11 7.89 14.67 8.17 14.42C5.95 14.17 3.62 13.31 3.62 9.5C3.62 8.39 4 7.5 4.65 6.79C4.55 6.54 4.2 5.5 4.75 4.15C4.75 4.15 5.59 3.88 7.5 5.17C8.29 4.95 9.15 4.84 10 4.84C10.85 4.84 11.71 4.95 12.5 5.17C14.41 3.88 15.25 4.15 15.25 4.15C15.8 5.5 15.45 6.54 15.35 6.79C16 7.5 16.38 8.39 16.38 9.5C16.38 13.32 14.04 14.16 11.81 14.41C12.17 14.72 12.5 15.33 12.5 16.26V19C12.5 19.27 12.66 19.59 13.17 19.5C17.14 18.16 20 14.42 20 10C20 8.68678 19.7413 7.38642 19.2388 6.17317C18.7362 4.95991 17.9997 3.85752 17.0711 2.92893C16.1425 2.00035 15.0401 1.26375 13.8268 0.761205C12.6136 0.258658 11.3132 0 10 0Z"
                  fill='currentColor'
                  className="text-dark dark:text-white"
                />
                </g>
                <defs>
                <clipPath id="clip0_1257_402">
                <rect width="20" height="19.5155" fill="white"/>
                </clipPath>
                </defs>
              </svg>
            </div>
            <a href={project?.githubUrl} className="hover:underline duration-300 text-xs font-medium text-black dark:text-white">{project?.githubUrl?.split('/').splice(-2,2).join('/')}</a>
          </div>
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
          {project.status === "READY" && (
            <p className="text-sm text-gray-500">Waiting for the Admin to approve for Deployment.</p>
          )}
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

const Deployment = ({ project }: { project: any }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [confirmedProjectName, setConfirmedProjectName] = useState<string>("");
  const [deployedLink, setDeployedLink] = useState<string>("");

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

  return (
    <div className="w-full flex flex-col justify-start items-start gap-2">
      <p className="text-2xl text-purple-500 font-semibold">K8s Deployment</p>
      <div className="w-full p-5 bg-white dark:bg-stone-950 rounded-md bdr cursor-pointer duration-300 flex flex-col justify-start items-start gap-2">
        <p className="text-lg font-medium text-purple-500">
          Deploy to life-au.live Cluster
        </p>
        <p className="text-sm text-stone-400 dark:text-stone-500">
          Please type in the project name{" "}
          <span className="font-semibold">{project?.name}</span> to confirm the
          deployment.
        </p>
        <div className="w-full flex justify-start items-center gap-2">
          <Input
            onChangeCapture={(e: any) =>
              setConfirmedProjectName(e.target.value)
            }
            className="disabled:opacity-80"
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
