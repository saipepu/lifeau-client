"use client"

import React, { useEffect, useState } from 'react'
import Tabbar from '../_components/Tabbar'
import { getAllContainer } from "@/app/api/container/getAllContainer";
import { EmitSocket } from "@/utils/socket/SocketEmit";
import Searchbar from './_components/Searchbar'
import RepoCard from './_components/RepoCard'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const Dashbaord = () => {

  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('Repositories')
  const tabs = ['Repositories', 'Settings']
  const [containers, setContainers] = useState<any[]>([]);
  const { data: session } = useSession();

  const GetAllContainer = async () => {
    if(!session?.lifeAuUser?._id) return;
    const response = await getAllContainer({ userId: session?.lifeAuUser?._id });
    console.log(response, "response")

    if(response.success) {
      setContainers(response?.message.map((container: any) => container.container));
    } else {
      console.log('Error GetAllContainer', response)
    }
  }

  // Handle Socket
  useEffect(() => {
    GetAllContainer();
    EmitSocket("joinRoom", "life.au");
  }, [session])

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

      <div className="z-50 w-full max-w-[1500px] flex-1 flex flex-col justify-start items-start gap-5 p-5 py-20">
        <div className="w-full max-w-[800px] flex justify-start items-start gap-5">

          {/* <ContainerTable containers={containers} /> */}
        </div>
      </div>
    </>
  )
}

export default Dashbaord

