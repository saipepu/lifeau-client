"use client";

import React, { useEffect, useState } from 'react'
import Searchbar from '../../_components/Searchbar'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getUserContainers } from '@/app/api/container/getUserContainers';
import { getAllUsersContainers } from '@/app/api/container/getAllUsersContainers';
import { EmitSocket } from '@/utils/socket/SocketEmit';
import RepoCard from '../../_components/RepoCard';
import Tabbar from '@/app/_components/Tabbar';

const page = () => {

  const router = useRouter();
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
  const [userContainers, setUserContainers] = useState<any[]>([]);
  const [allUsersContainers, setAllUsersContainers] = useState<any[]>([]);
  const { data: session } = useSession();

  const GetUserContainers = async () => {
    if(!session?.lifeAuUser?._id) return;
    const response = await getUserContainers({ userId: session?.lifeAuUser?._id });
    console.log('userContainers', response)

    if(response.success) {
      setUserContainers(response?.message.map((container: any) => container.container));
    } else {
      console.log('Error GetUserContainers', response)
    }
  }

  const GetAllUsersContainers = async () => {
    const response = await getAllUsersContainers();
    console.log('allUsersContainers', response)

    if(response.success) {
      setAllUsersContainers(response?.message.map((container: any) => container.container));
    } else {
      console.log('Error GetUserContainers', response)
    }
  }

  // Handle Socket
  useEffect(() => {
    // EmitSocket("joinRoom", "life.au");
    if(session?.lifeAuUser?.mode === 'admin') {
      GetAllUsersContainers();
    } else {
      GetUserContainers();
    }
  }, [session])

  return (
    <div className='w-full h-full flex flex-col justify-start items-center'>
      <div className='w-full flex flex-col justify-start items-center gap-1 bg-white dark:bg-stone-950 border-b dark:border-stone-700'>
        <Tabbar tabs={adminTabs} numberOfRepositories={allUsersContainers.length.toString()} />
      </div>
      <div className='w-full max-w-[1600px] flex-1 flex flex-col justify-start items-center gap-1 bg-transparent pb-10'>
        <Searchbar />
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5 pt-0'>
          {allUsersContainers.map((container, index) => {
            return (
              <div key={index} className='col-span-1' onClick={() => router.push(`/dashboard/admin/all-repositories/${container?.name}/overview`)}>
                <RepoCard container={container} adminView={false} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default page