"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getAllUsersContainers } from "@/app/api/container/getAllUsersContainers";
import { getAllDeployments } from "@/app/api/k8s/getAllDeployments";
import { getAllServices } from "@/app/api/k8s/getAllServices";
import { getAllIngresses } from "@/app/api/k8s/getAllIngresses";
import Tabbar from "@/app/_components/Tabbar";
import { Box, ChevronDown, ChevronUp, FileBox, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const tabs = ['All', 'K8s Deployments', 'K8s Services', 'K8s Ingresses']
  const adminTabs = [
    {
      name: "All Repositories",
      link: "/dashboard/admin/all-repositories",
    },
    {
      name: "Resources",
      link: "/dashboard/admin/resources",
    }
  ];
  const [allUsersContainers, setAllUsersContainers] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState(tabs[0])
  const [deployments, setDeployments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [ingresses, setIngresses] = useState<any[]>([]);

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
    if(response.success) {
      setDeployments(response.message);
    } else {
      console.log("Error GetK8sDeployments", response);
    }
  }

  const GetK8sServices = async () => {
    const response = await getAllServices();
    if(response.success) {
      setServices(response.message);
    } else {
      console.log("Error GetK8sServices", response);
    }
  }
  
  const GetK8sIngresses = async () => {
    const response = await getAllIngresses();
    if(response.success) {
      setIngresses(response.message);
    } else {
      console.log("Error GetK8sIngresses", response);
    }
    console.log(response)
  }

  // Handle Socket
  useEffect(() => {
    // EmitSocket("joinRoom", "life.au");
    GetAllUsersContainers();
    GetK8sDeployments();
    GetK8sServices();
    GetK8sIngresses();
  }, [session]);

  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      <div className="w-full flex flex-col justify-start items-center gap-1 bg-white dark:bg-stone-950 border-b dark:border-stone-700">
        <Tabbar
          tabs={adminTabs}
          numberOfRepositories={allUsersContainers.length.toString()}
        />
      </div>
      <div className="w-full flex-1 flex flex-col justify-start items-center gap-1 bg-transparent pb-10">
        <div className='w-full flex-1 flex flex-col justify-start items-center bg-transparent'>
          <div className='w-full flex justify-center items-center gap-2 bg-white dark:bg-stone-950 border-b dark:border-stone-700'>
            <div className='w-full max-w-[1600px] p-5 py-8 flex justify-start items-center gap-2'>
              <h1 className='pl-2 text-2xl font-semibold text-black dark:text-white text-left'>Life.au • Resources</h1>
            </div>
          </div>

          <div className="w-full max-w-[1600px] h-full flex justify-center items-start bg-transparent">
            <div className="w-full h-full max-w-[15%] min-w-[200px] hidden md:flex flex-col gap-3 justify-start items-start p-5">
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

            <div className="w-full min-h-full h-fit flex flex-col justify-start items-start p-5 gap-5 border-l-[1px] border-gray-200 dark:border-stone-700">

              {(selectedTab === "K8s Ingresses" || selectedTab === "All") && (
                <K8sIngresses ingresses={ingresses} />
              )}

              {(selectedTab === "All") && (
                <div className="w-full h-[1px] bg-stone-200 dark:bg-stone-800"></div>
              )}

              {(selectedTab === "K8s Deployments" || selectedTab === "All") && (
                <K8sDeployments deployments={deployments} />
              )}

              {(selectedTab === "All") && (
                <div className="w-full h-[1px] bg-stone-200 dark:bg-stone-800"></div>
              )}

              {(selectedTab === "K8s Services" || selectedTab === "All") && (
                <K8sServices services={services} />
              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

const K8sDeployments = ({
  deployments,
}: {
  deployments: any[];
}) => {

  const [showMore, setShowMore] = useState(false);
  deployments = deployments.slice(0, showMore ? deployments.length : 2);
  console.log(deployments.length)

  return (
    <div className="w-full flex flex-col justify-start items-start gap-5">
      <h1 className="text-2xl font-semibold pl-2">K8s Deployments</h1>
      <div className="w-full flex flex-col justify-start items-start gap-3">
        {deployments.map((deployment, index) => {
          let uiData = {
            name: deployment?.metadata.name,
            namespace: deployment?.metadata.namespace,
            labels: deployment?.metadata.labels,
            creationTimestamp: deployment?.metadata.creationTimestamp,
            replicas: deployment?.spec.replicas,
            updatedReplicas: deployment?.status.updatedReplicas,
            availableReplicas: deployment?.status.availableReplicas,
            readyReplicas: deployment?.status.readyReplicas,
            containers: deployment?.spec.template.spec.containers,
            conditions: deployment?.status.conditions,
          }
          return (
            <div key={index} className="w-full p-5 bg-white dark:bg-stone-950 rounded-md bdr cursor-pointer duration-300 flex flex-col justify-start items-start gap-1">
              <div className="w-full flex justify-between items-start gap-2">
                <div className="w-10 h-10 flex justify-center items-center bg-green-100 dark:bg-green-800 rounded-md">
                  <Box size={24} className="stroke-green-500"/>
                </div>
                <div className="h-full w-full flex-1 flex flex-col justify-start items-start">
                  <p className="text-base md:text-lg font-medium">{uiData.name}</p>
                  <p className="text-sm text-stone-400 dark:text-stone-500 whitespace-nowrap">
                    namespace: {uiData.namespace}
                  </p>
                </div>
                <div className="h-full flex flex-col justify-start items-start">
                  <p className="text-sm text-stone-400 dark:text-stone-500">{new Date(uiData.creationTimestamp).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="w-full h-[1px] bg-stone-200 dark:bg-stone-800 my-2"></div>
              <div className="w-full flex flex-col justify-start items-start gap-2">
                <div className="w-full flex justify-start items-start gap-2">
                  {uiData.containers.map((container: any, index: number) => {
                    return (
                      <div key={index} className="w-full flex justify-start items-start gap-5">
                        <div className="flex flex-col justify-start items-start">
                          <p className="text-sm font-medium">Image</p>
                          <p className="text-sm text-stone-400 dark:text-stone-500">{container.image}</p>
                        </div>
                        <div className="flex flex-col justify-start items-start">
                          <p className="text-sm font-medium">Image Pull Policy</p>
                          <p className="text-sm text-stone-400 dark:text-stone-500">{container.imagePullPolicy}</p>
                        </div>
                        <div className="flex flex-col justify-start items-start">
                          <p className="text-sm font-medium">Name</p>
                          <p className="text-sm text-stone-400 dark:text-stone-500">{container.name}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <Button className="p-0 pl-2 bg-transparent hover:bg-transparent hover:opacity-40 text-black dark:text-white duration-300 transition-all" onClick={() => setShowMore(!showMore)}>
        <p className="text-sm font-medium duration-300 transition-all">{showMore ? "Show Less" : "Show More"}</p>
        {showMore ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </Button>
    </div>
  )
}

const K8sServices = ({
  services
}: {
  services: any[];
}) => {

  const [showMore, setShowMore] = useState(false);
  services = services.slice(0, showMore ? services.length : 2);

  return (
    <div className="w-full flex flex-col justify-start items-start gap-5">
      <h1 className="text-2xl font-semibold pl-2">K8s Services</h1>
      <div className="w-full flex flex-col justify-start items-start gap-3">
        {services.map((service, index) => {
          let uiData = {
            name: service?.metadata.name,
            namespace: service?.metadata.namespace,
            resourceVersion: service?.metadata.resourceVersion,
            uid: service?.metadata.uid,
            clusterIP: service?.spec.clusterIP,
            clusterIPs: service?.spec.clusterIPs,
            ports: service?.spec.ports,
            type: service?.spec.type,
          }
          return (
            <div key={index} className="w-full p-5 bg-white dark:bg-stone-950 rounded-md bdr cursor-pointer duration-300 flex flex-col justify-start items-start gap-1">
              <div className="w-full flex justify-between items-start gap-2">
                <div className="w-10 h-10 flex justify-center items-center bg-yellow-50 dark:bg-yellow-800 rounded-md">
                  <FileBox size={24} className="stroke-yellow-500" />
                </div>
                <div className="h-full w-full flex-1 flex flex-col justify-start items-start">
                  <p className="text-base md:text-lg font-medium">{uiData.name}</p>
                  <p className="text-sm text-stone-400 dark:text-stone-500 whitespace-nowrap">
                    clusterIP: {uiData.clusterIP}
                  </p>
                </div>
                <div className="h-full flex flex-col justify-start items-start">
                  <p className="text-xs text-stone-400 dark:text-stone-500 whitespace-nowrap">{uiData.namespace}</p>
                </div>
              </div>
              <div className="w-full h-[1px] bg-stone-200 dark:bg-stone-800 my-2"></div>
              <div className="w-full flex flex-col justify-start items-start gap-2">
                <div className="w-full flex justify-start items-start gap-2">
                  {uiData.ports.map((port: any, index: number) => {
                    return (
                      <div key={index} className="w-full flex justify-start items-start gap-5">
                        <div className="flex flex-col justify-start items-start">
                          <p className="text-sm font-medium">Port</p>
                          <p className="text-sm text-stone-400 dark:text-stone-500">{port.port}</p>
                        </div>
                        <div className="flex flex-col justify-start items-start">
                          <p className="text-sm font-medium">Protocol</p>
                          <p className="text-sm text-stone-400 dark:text-stone-500">{port.protocol}</p>
                        </div>
                        <div className="flex flex-col justify-start items-start">
                          <p className="text-sm font-medium">Targetport</p>
                          <p className="text-sm text-stone-400 dark:text-stone-500">{port.targetPort}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <Button className="p-0 pl-2 bg-transparent hover:bg-transparent hover:opacity-40 text-black dark:text-white duration-300 transition-all" onClick={() => setShowMore(!showMore)}>
        <p className="text-sm font-medium duration-300 transition-all">{showMore ? "Show Less" : "Show More"}</p>
        {showMore ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </Button>
    </div>
  )
}

const K8sIngresses = ({
  ingresses
}: {
  ingresses: any[];
}) => {

  const [showMore, setShowMore] = useState(false);
  ingresses = ingresses.slice(0, showMore ? ingresses.length : 2);

  return (
    <div className="w-full flex flex-col justify-start items-start gap-5">
      <h1 className="text-2xl font-semibold pl-2">K8s Ingresses</h1>
      <div className="w-full flex flex-col justify-start items-start gap-3">
        {ingresses.map((ingress, index) => {
          let uiData = {
            name: ingress?.metadata.name,
            namespace: ingress?.metadata.namespace,
            resourceVersion: ingress?.metadata.resourceVersion,
            uid: ingress?.metadata.uid,
            host: ingress?.spec.rules[0].host,
            paths: ingress?.spec.rules[0].http.paths,
          }
          return (
            <div key={index} className="w-full p-5 bg-white dark:bg-stone-950 rounded-md bdr cursor-pointer duration-300 flex flex-col justify-start items-start gap-1">
              <div className="w-full flex justify-between items-start gap-2">
                <div className="w-10 h-10 flex justify-center items-center bg-purple-50 dark:bg-purple-800 rounded-md">
                  <Globe size={24} className="stroke-purple-500 dark:stroke-purple-400" />
                </div>
                <div className="h-full w-full flex-1 flex flex-col justify-start items-start">
                  <p className="text-base md:text-lg font-medium">{uiData.name}</p>
                  <p className="text-sm text-stone-400 dark:text-stone-500 whitespace-nowrap">
                    namespace: {uiData.namespace}
                  </p>
                </div>
                <div className="h-full flex flex-col justify-start items-start">
                  <p className="text-xs text-stone-400 dark:text-stone-500 whitespace-nowrap">Vr: {uiData.resourceVersion}</p>
                </div>
              </div>
              <div className="w-full h-[1px] bg-stone-200 dark:bg-stone-800 my-2"></div>
              <div className="w-full flex flex-col justify-start items-start gap-2">
                <div className="w-full flex justify-start items-start gap-2">
                  {uiData.paths.map((port: any, index: number) => {
                    return (
                      <div key={index} className="w-full flex justify-start items-start gap-5">
                        <div className="flex flex-col justify-start items-start">
                          <p className="text-sm font-medium">Host</p>
                          <Link className="text-sm text-stone-400 dark:text-stone-500 duration-300 transition-all hover:underline" href={`https://${uiData.host}`} target="_blank">{uiData.host}</Link>
                        </div>
                        <div className="flex flex-col justify-start items-start">
                          <p className="text-sm font-medium">Name</p>
                          <p className="text-sm text-stone-400 dark:text-stone-500">{port.backend.service.name}</p>
                        </div>
                        <div className="flex flex-col justify-start items-start">
                          <p className="text-sm font-medium">Port</p>
                          <p className="text-sm text-stone-400 dark:text-stone-500">{port.backend.service.port.number}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <Button className="p-0 pl-2 bg-transparent hover:bg-transparent hover:opacity-40 text-black dark:text-white duration-300 transition-all" onClick={() => setShowMore(!showMore)}>
        <p className="text-sm font-medium duration-300 transition-all">{showMore ? "Show Less" : "Show More"}</p>
        {showMore ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </Button>
    </div>
  )
}

export default page;
