"use client"

import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../_components/Navbar'
import Tabbar from '../_components/Tabbar'
import Footer from '../_components/Footer'
import { Button } from "@/components/ui/button";
import { ConfettiRef } from "@/components/ui/confetti";
import IconCloud from "@/components/ui/icon-cloud";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import dynamic from "next/dynamic";
import { getAllContainer } from "@/app/_api/container/getAllContainer";
import ContainerTable from '../_components/ContainerTable'
import socket from "@/utils/socket";
import { EmitSocket } from "@/utils/socket/SocketEmit";
import Searchbar from '../landing/_components/Searchbar'
import RepoCard from './_components/RepoCard'
import { useRouter } from 'next/navigation'
const Confetti = dynamic(() => import('@/components/ui/confetti'), {
  ssr: false,
});

const Dashbaord = () => {

  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('Repositories')
  const tabs = ['Repositories', 'Settings']

  const projects = [
    {
      name: 'Project 1',
      description: 'This is a project',
      url: 'https://github.com',
      date: '2021-10-10',
    },
    {
      name: 'Project 2',
      description: 'This is a project',
      url: 'https://github.com',
      date: '2021-10-10',
    },
    {
      name: 'Project 3',
      description: 'This is a project',
      url: 'https://github.com',
      date: '2021-10-10',
    },
    {
      name: 'Project 4',
      description: 'This is a project',
      url: 'https://github.com',
      date: '2021-10-10',
    },
    {
      name: 'Project 5',
      description: 'This is a project',
      url: 'https://github.com',
      date: '2021-10-10',
    },
    {
      name: 'Project 6',
      description: 'This is a project',
      url: 'https://github.com',
      date: '2021-10-10',
    },
  ]

  const confettiRef = useRef<ConfettiRef>(null);
  const slugs = [
    "typescript",
    "javascript",
    "dart",
    "java",
    "react",
    "flutter",
    "android",
    "html5",
    "css3",
    "nodedotjs",
    "express",
    "nextdotjs",
    "prisma",
    "amazonaws",
    "postgresql",
    "firebase",
    "nginx",
    "vercel",
    "testinglibrary",
    "jest",
    "cypress",
    "docker",
    "git",
    "jira",
    "github",
    "gitlab",
    "visualstudiocode",
    "androidstudio",
    "sonarqube",
    "figma",
  ];
  const [githubUrl, setgithubUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [deploymentIds, setDeploymentIds] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [containers, setContainers] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const handleSubmit = async () => {
    console.log(githubUrl);

    if(githubUrl === "") return;

    setLoading(true);
    setMessage("It may take a few minutes to deploy your project. Please wait...");
    const response = await fetch("http://localhost:4001/build", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        githubUrl: githubUrl,
      }),
    }).then((res) => res.json())
    .catch((error) => {
      console.error('Error:', error);
    });
    GetAllContainer();

    if(response.success) {
      console.log(response);
      confettiRef.current?.fire({});
      setMessage("Your project has been pushed to DockerHub successfully!");
    }
    else {
      console.error(response);
    }
    setTimeout(() => {
      setLoading(false);
      router.push(`/dashboard/${githubUrl.split('/').splice(-1,1).join('/')}`);
    }, 1000);
    setTimeout(() => {
      setMessage("");
    }, 3000);

  }

  const GetAllContainer = async () => {
    const response = await getAllContainer();
    
    if(response.success) {
      setContainers(response.message);
    } else {
      console.error('Error GetAllContainer', response)
    }
  }

  useEffect(() => {
    GetAllContainer();
    EmitSocket("joinRoom", "life.au");
  }, [])

  socket.on("log", (log) => {
    console.log(log, "log" )
    if(!logs.includes(log)) {
      setLogs([log, ...logs])
    }
  })
  socket.on("connectedDevices", (devices) => {
    console.log(devices, "connectedDevices" )  
  })

  return (
    <>
      <div className='w-full flex flex-col justify-start items-center gap-1 bg-white dark:bg-stone-950'>
        <Tabbar selectedTab={selectedTab} setSelectedTab={setSelectedTab} tabs={tabs} />
      </div>

      <div className='w-full max-w-[1500px] flex-1 flex flex-col justify-start items-center gap-1 bg-transparent pb-10'>
        <Searchbar />
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5 pt-0'>
          {containers.map((container, index) => {
            return (
              <div key={index} className='col-span-1' onClick={() => router.push(`/dashboard/${container.name}`)}>
                <RepoCard container={container} />
              </div>
            )
          })}
        </div>
      </div>

      <div className="z-50 w-full max-w-[1500px] flex-1 flex flex-col justify-start items-start gap-5 py-20">
        <p className="w-full text-2xl font-semibold pb-1 border-b">Deploy your project in a minute 🎉</p>
        <div className="w-full max-w-[800px] flex justify-start items-start gap-5">
          <div className="w-full max-w-[300px] flex flex-col justify-start items-start gap-2">
            <div className="w-full flex flex-col justify-center items-start gap-2">
              <Input placeholder="github.com/username/repo" value={githubUrl} onChange={(e) => setgithubUrl(e.target.value)} />
              <Button
                onClick={() => handleSubmit()}
                disabled={loading}
                className='h-8'
              >
                {loading ? <Loader className="w-6 h-6 animate-spin" /> : "Submit"}
              </Button>
            </div>
            {message && <p className="text-sm mt-2">{message}</p>}
            <Confetti
              ref={confettiRef}
              className="absolute left-0 top-0 z-0 size-full pointer-events-none"
            />

          </div>

          {/* <ContainerTable containers={containers} /> */}
        </div>
      </div>
    </>
  )
}

export default Dashbaord

