"use client";

import Tabbar from '@/app/_components/Tabbar';
import socket from '@/utils/socket';
import { EmitSocket } from '@/utils/socket/SocketEmit';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { getOneContainer } from '@/app/api/container/getOneContainer';
import { deleteContainer } from '@/app/api/container/deleteContainer';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, Loader } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { queueApi } from '@/app/api/api';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

const page = () => {

  const { projectName } = useParams()
  const tabs = ['My Repositories', 'Overview', 'Settings']
  const adminTabs = ['All Repositories', 'Overview', 'Settings']
  const [selectedTab, setSelectedTab] = React.useState('Overview');
  const [logs, setLogs] = useState<any[]>([]);
  const [project, setProject] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { data: session } = useSession();
  const router = useRouter();
  const path = usePathname();
  
  const GetOneContainer = async () => {
    const response = await getOneContainer({ name: projectName?.toString().split('--of-')[0] })
    if(response.success) {
      setProject(response.message)
    } else {
      console.log(response.message, "response.message")
    }
  }

  console.log(project)
  const DeleteContainer = async () => {
    const response = await deleteContainer({ name: projectName?.toString().split('--of-')[0] })
    if(response.success) {
      router.push('/dashboard')
    } else {
      console.log(response.message, "response.message")
    }
  }

  const handleSubmit = async () => {

    setLoading(true);
    setMessage("It may take a few minutes to deploy your project. Please wait...");
    if(!project?.githubUrl && !session?.lifeAuUser._id) {
      window.alert("Error: Please wait")
      return "Error: Missing required fields"
    }
    const response = await fetch(`${queueApi}/build`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        githubUrl: project?.githubUrl,
        userId: session?.lifeAuUser._id,
      }),
    }).then((res) => res.json())
    .catch((error) => {
      console.log('Error:', error);
    });

    if(response.success) {
      console.log(response);
      setMessage("Your project has been pushed to DockerHub successfully!");
    }
    else {
      console.error(response);
    }
    setTimeout(() => {
      setLoading(false);
      GetOneContainer();
    }, 1000);
    setTimeout(() => {
      setMessage("");
    }, 3000);

  }

  const handleDelete = async () => {
    DeleteContainer();
  }

  useEffect(() => {
    EmitSocket("joinRoom", "life.au");
    GetOneContainer()
  }, [])

  socket.on("log", (log) => {
    let logList = logs.map((log) => log.message)
    if(!logList.includes(log)) {
      setLogs([
        {
          message: log,
          timestamp: new Date()
        },
        ...logs
      ])
    }
  })
  socket.on("connectedDevices", (devices) => {
    console.log(devices, "connectedDevices" )  
  })

  return (
    <>
      <div className='w-full flex flex-col justify-start items-center gap-1 bg-white dark:bg-stone-950 border-b dark:border-stone-700'>
        <Tabbar selectedTab={selectedTab} setSelectedTab={setSelectedTab} tabs={session?.lifeAuUser?.mode === 'admin' ? adminTabs : tabs} numberOfRepositories={path.split('--of-')[1]}/>
      </div>
      
      {selectedTab === "Overview" && (
        <div className='w-full flex-1 flex flex-col justify-start items-center pb-10 gap-5'>
          <div className='w-full flex justify-center items-start gap-2 bg-white dark:bg-stone-950 border-b dark:border-stone-700'>
            <div className='w-full max-w-[1500px] p-5 py-8 flex justify-start items-center gap-2'>
              <h1 className='pl-2 text-2xl font-semibold text-black dark:text-white text-left'>{projectName?.toString().split('--of-')[0]} • Overview</h1>
              <div className={`
                  font-semibold p-1 px-2 text-xs rounded-full mr-auto h-full flex justify-center items-center
                  ${project?.status === "DEPLOYED" && "text-green-500 bg-green-200 dark:opacity-90"}
                  ${project?.status === "PENDING" && "text-yellow-500 bg-yellow-200 dark:opacity-90"}
                  ${project?.status === "FAILED" && "text-red-500 bg-red-200 dark:opacity-90"}
                  `}>
                  {project?.status}
              </div>
              <div className='flex justify-end items-center gap-2'>
                <Button className='p-2 bg-black dark:bg-white h-8 rounded-md flex justify-center items-center' onClick={() => handleSubmit()}>
                  <p className='text-sm text-white dark:text-black whitespace-nowrap'>
                    Reject
                  </p>
                </Button>
                <Button className='p-2 bg-black dark:bg-white h-8 rounded-md flex justify-center items-center' onClick={() => handleSubmit()}>
                  <p className='text-sm text-white dark:text-black whitespace-nowrap'>
                    Approve
                  </p>
                </Button>
                <Button className='p-2 bg-black dark:bg-white h-8 rounded-md flex justify-center items-center' onClick={() => handleSubmit()}>
                  <p className='text-sm text-white dark:text-black whitespace-nowrap'>
                    {loading ?
                      <Loader size={20} className='animate-spin' />
                    :
                      "Redeploy"
                    }
                  </p>
                </Button>
              </div>
            </div>
          </div>
          <div className='w-full max-w-[1500px] p-5 flex justify-start items-start gap-2'>
            <div className="w-full max-h-[300px] border rounded-md p-2 flex flex-col justify-start items-start gap-2 bg-white dark:bg-stone-950">
              <p className="text-sm font-semibold">Logs</p>
              <div className="w-full overflow-y-scroll flex flex-col-reverse justify-start items-start gap-2">
                {logs.map((log, index) => (
                  <div className='w-full flex justify-start items-start gap-2' key={index}>
                    <p className="text-sm font-medium whitespace-nowrap min-w-[90px] w-fit">{log.timestamp.toLocaleTimeString()}</p>
                    <p className="text-sm leading-tight">{log.message}</p>
                  </div>
                ))}
                {logs.length === 0 && <p className="text-sm text-stone-500 leading-tight mt-1 whitespace-nowrap">No logs available</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === "Settings" && (
        <div className='w-full flex-1 flex flex-col justify-start items-center pb-10 gap-5'>
          <div className='w-full flex-1 flex flex-col justify-start items-center pb-10 gap-5'>
            <div className='w-full flex justify-center items-start gap-2 bg-white dark:bg-stone-950 border-b dark:border-stone-700'>
              <div className='w-full max-w-[1500px] p-5 py-8 flex justify-start items-center gap-2'>
                <h1 className='pl-2 text-2xl font-semibold text-black dark:text-white text-left'>{projectName?.toString().split('--of-')[0]} • {selectedTab}</h1>
                <div className={`
                    font-semibold p-1 px-2 text-xs rounded-full mr-auto h-full flex justify-center items-center
                    ${project?.status === "DEPLOYED" && "text-green-500 bg-green-200 dark:opacity-90"}
                    ${project?.status === "PENDING" && "text-yellow-500 bg-yellow-200 dark:opacity-90"}
                    ${project?.status === "FAILED" && "text-red-500 bg-red-200 dark:opacity-90"}
                    `}>
                    {project?.status}
                </div>
                <div className='flex justify-end items-center gap-2'>
                  <Button className='p-2 bg-black dark:bg-white h-8 rounded-md flex justify-center items-center' onClick={() => handleSubmit()}>
                    <p className='text-sm text-white dark:text-black whitespace-nowrap'>
                      Reject
                    </p>
                  </Button>
                  <Button className='p-2 bg-black dark:bg-white h-8 rounded-md flex justify-center items-center' onClick={() => handleSubmit()}>
                    <p className='text-sm text-white dark:text-black whitespace-nowrap'>
                      Approve
                    </p>
                  </Button>
                  <Button className='p-2 bg-black dark:bg-white h-8 rounded-md flex justify-center items-center' onClick={() => handleSubmit()}>
                    <p className='text-sm text-white dark:text-black whitespace-nowrap'>
                      {loading ?
                        <Loader size={20} className='animate-spin' />
                      :
                        "Redeploy"
                      }
                    </p>
                  </Button>
                </div>
              </div>
            </div>
            <div className='w-full max-w-[1500px] p-5 flex flex-col justify-start items-start gap-2'>
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
                        Are you sure you want to logout. You will be redirected to the landing page.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className='h-8'>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className='className="p-2 bg-red-500 dark:bg-red-200 h-8 rounded-md flex justify-center items-center"'
                        onClick={() => {handleDelete()}}
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
      )}
      
    </>
  )
}

export default page