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
import SettingView from './profile/general/_components/SettingView';

const Dashbaord = () => {

  const router = useRouter();
  const tabs = ['My Repositories', 'Settings']
  const adminTabs = ['All Repositories', 'Resources', 'Settings']
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
        <Tabbar tabs={session?.lifeAuUser?.mode === 'admin' ? adminTabs : tabs} numberOfRepositories={allUsersContainers.length.toString()}/>
      </div>

      {/* Main Content */}
      {selectedTab === 'All Repositories' && (
        <div className='w-full max-w-[1600px] flex-1 flex flex-col justify-start items-center gap-1 bg-transparent pb-10'>
          <Searchbar />
          <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5 pt-0'>
            {allUsersContainers.map((container, index) => {
              return (
                <div key={index} className='col-span-1' onClick={() => router.push(`/dashboard/project/${container?.name}--of-${allUsersContainers.length}`)}>
                  <RepoCard container={container} adminView={true} />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Resources */}
      {selectedTab === 'Resources' && (
        <Resources />
      )}

      {/* Settings */}
      {selectedTab === 'Settings' && (
        <SettingView />
      )}

    </>
  )
}

const Resources = () => {

  const { data: session } = useSession();
  const tabs = ['K8s Deployments', 'K8s Services', 'K8s Ingresses']
  const [selectedTab, setSelectedTab] = useState(tabs[0])

  return (
    <div className='w-full flex-1 flex flex-col justify-start items-center bg-transparent'>
      <div className='w-full flex justify-center items-center gap-2 bg-white dark:bg-stone-950 border-b dark:border-stone-700'>
        <div className='w-full max-w-[1600px] p-5 py-8 flex justify-start items-center gap-2'>
          <h1 className='pl-2 text-2xl font-semibold text-black dark:text-white text-left'>{session?.lifeAuUser?.name} • Resources</h1>
        </div>
      </div>

      <div className="w-full max-w-[1600px] h-full flex justify-center items-start bg-transparent">
        <div className="w-full h-full max-w-[15%] hidden md:flex flex-col gap-3 justify-start items-start p-5">
          {tabs.map((tab, index) => {
            return (
              <p
                key={index}
                className={`pl-2 text-base hover:scale-105 duration-300 cursor-pointer ${selectedTab === tab ? "text-black dark:text-white" : "text-stone-400 dark:text-stone-500"}`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </p>
            );
          })}
        </div>

        <div className="w-full min-h-full h-fit flex flex-col justify-start items-start p-5 gap-10 border-l-[1px] border-gray-200 dark:border-stone-700">

        </div>

      </div>

    </div>
  )
}

export default Dashbaord

