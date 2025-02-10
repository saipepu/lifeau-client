"use client"

import React, { useEffect, useState } from 'react'
import Tabbar from '../_components/Tabbar'
import { getUserContainers } from '@/app/api/container/getUserContainers';
import { getAllUsersContainers } from '@/app/api/container/getAllUsersContainers';
import { EmitSocket } from "@/utils/socket/SocketEmit";
import Searchbar from './_components/Searchbar'
import RepoCard from './_components/RepoCard'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import SettingView from './_components/Setting/SettingView';

const Dashbaord = () => {

  const router = useRouter();
  const tabs = ['My Repositories', 'Settings']
  const adminTabs = ['All Repositories', 'Settings']
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0]);
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
    EmitSocket("joinRoom", "life.au");
    if(session?.lifeAuUser?.mode === 'admin') {
      GetAllUsersContainers();
      setSelectedTab(adminTabs[0])
    } else {
      GetUserContainers();
      setSelectedTab(tabs[0])
    }
  }, [session])

  return (
    <>
      <div className='w-full flex flex-col justify-start items-center gap-1 bg-white dark:bg-stone-950 border-b dark:border-stone-700'>
        <Tabbar selectedTab={selectedTab} setSelectedTab={setSelectedTab} tabs={session?.lifeAuUser?.mode === 'admin' ? adminTabs : tabs} numberOfRepositories={allUsersContainers.length.toString()}/>
      </div>

      {/* Main Content */}
      {selectedTab === 'My Repositories' && (
        <div className='w-full max-w-[1500px] flex-1 flex flex-col justify-start items-center gap-1 bg-transparent pb-10'>
          <Searchbar />
          <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5 pt-0'>
            {userContainers.map((container, index) => {
              return (
                <div key={index} className='col-span-1' onClick={() => router.push(`/dashboard/project/${container.name}--of-${userContainers.length}`)}>
                  <RepoCard container={container} adminView={false} />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      {selectedTab === 'All Repositories' && (
        <div className='w-full max-w-[1500px] flex-1 flex flex-col justify-start items-center gap-1 bg-transparent pb-10'>
          <Searchbar />
          <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5 pt-0'>
            {allUsersContainers.map((container, index) => {
              return (
                <div key={index} className='col-span-1' onClick={() => router.push(`/dashboard/project/${container.name}--of-${allUsersContainers.length}`)}>
                  <RepoCard container={container} adminView={true} />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Settings */}
      {selectedTab === 'Settings' && (
        <SettingView />
      )}



    </>
  )
}

export default Dashbaord

