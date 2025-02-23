"use client";

import Tabbar from '@/app/_components/Tabbar'
import React from 'react'

const page = () => {

  const tabs = [
    {
      name: "General",
      link: '/dashboard/profile/general'
    },
    {
      name: "My Projects",
      link: '/dashboard/profile/my-projects'
    }
  ]

  return (
    <div className='w-full h-full flex flex-col justify-start items-center'>
      <div className='w-full flex flex-col justify-start items-center gap-1 bg-white dark:bg-stone-950 border-b dark:border-stone-700'>
        <Tabbar tabs={tabs} />
      </div>
      <div className='w-full flex-1 flex flex-col justify-start items-center gap-1 bg-transparent'>
        All Repo
      </div>
    </div>
  )
}

export default page