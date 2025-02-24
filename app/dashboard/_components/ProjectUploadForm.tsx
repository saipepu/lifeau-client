"use client";
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CircleX, Cross, Loader } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"
import dynamic from 'next/dynamic';
import { ConfettiRef } from '@/components/ui/confetti';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import ContainerTable from '@/app/_components/ContainerTable';
import { queueApi } from '@/app/api/api';
const Confetti = dynamic(() => import('@/components/ui/confetti'), {
  ssr: false,
});

const ProjectUploadForm = () => {

  const confettiRef = useRef<ConfettiRef>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [repos, setRepos] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [filteredRepos, setFilteredRepos] = useState<any[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async ({ githubUrl }: { githubUrl: string}) => {

    console.log('handleSubmit', githubUrl);
    if(githubUrl === "") return;

    setLoading(true);
    setMessage("It may take a few minutes to deploy your project. Please wait...");
    const response = await fetch(`${queueApi}/build`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        githubUrl: githubUrl,
        userId: session?.lifeAuUser._id,
      }),
    }).then((res) => res.json())
    .catch((error) => {
      console.log('Error:', error);
    });

    if(response.success) {
      console.log(response);
      confettiRef.current?.fire({});
      setMessage("Your project has been pushed to DockerHub successfully!");
    }
    else {
      console.error(response);
    }
    console.log('handleSubmit', response);
    setTimeout(() => {
      setLoading(false);
      let projectName = githubUrl.split('/')[githubUrl.split('/').length - 1]
      router.push(`/dashboard/profile/my-projects/${projectName}`);
    }, 1000);
    setTimeout(() => {
      setMessage("");
    }, 3000);

  }

  const GetUserGitRepos = async () => {
    console.log(session)
    const response = await fetch("https://api.github.com/user/repos?per_page=50", {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.lifeAuUser?.githubToken}`,
      }
    }).then((res) => res.json())
    .catch((error) => {
      console.error('Error:', error);
    });
    if(response) {
      console.log(response);
      setRepos(response);
      setFilteredRepos(response);
    }
  }

  useEffect(() => {
    if(session) {
      GetUserGitRepos();
    }
  }, [session])

  useEffect(() => {
    if(repos) {
      setFilteredRepos(repos.filter((repo) => repo.name.toLowerCase().includes(filter.toLowerCase())));
    }
  }, [filter])

  return (
    <div className="w-full flex justify-start items-center">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className='p-2 bg-black dark:bg-white h-10 rounded-md flex justify-center items-center'>
            <p className='text-sm text-white dark:text-black whitespace-nowrap'>New Project</p>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className='h-full max-h-[600px] flex flex-col justify-start items-start gap-2'>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <p className="w-full text-2xl font-semibold pb-1">Deploy your project in a minute 🎉</p>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Upload your github repository that has DockerFile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <div className="w-full flex justify-center items-start gap-2">
              <div className='pr-2 flex-1 flex justify-start items-center gap-2 rounded-md bg-white dark:bg-stone-950 border bdr'>
                <Input placeholder="Search repository..." className='border-none' value={filter} onChange={(e) => setFilter(e.target.value)} />
                {filter && <CircleX size={16} stroke='gray' onClick={() => setFilter('')} className='cursor-pointer hover:stroke-black hover:dark:stroke-white'/>}
              </div>
              <AlertDialogCancel className='h-full'>Close</AlertDialogCancel>
            </div>
            {message && <p className="text-sm mt-2">{message}</p>}
            <Confetti
              ref={confettiRef}
              className="absolute left-0 top-0 z-0 size-full pointer-events-none"
            />
          </div>
          {loading ?
            <div className='w-full flex justify-center items-center gap-2'>
              <Loader size={32} stroke='black' className='animate-spin'/>
            </div>
          :
            <div className='w-full overflow-y-scroll flex justify-start items-start bdr rounded-md'>
              {filteredRepos.length === 0 ?
                <p className='text-sm text-gray-500 p-2'>No repositories found</p>
              : 
                <ContainerTable containers={filteredRepos} handleSubmit={handleSubmit} />
              }
            </div>
          }
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ProjectUploadForm