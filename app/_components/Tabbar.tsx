"use client"
import { SparklesText } from '@/components/sparkles-text';
import { Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react'

const Tabbar = ({
  selectedTab,
  setSelectedTab,
  tabs,
  numberOfRepositories
}: {
  selectedTab: string,
  setSelectedTab: (tab: string) => void,
  tabs: string[],
  numberOfRepositories: number
}) => {

  const { data: session } = useSession();

  return (
    <div className='w-full max-w-[1500px] flex justify-between items-center'>
      <div className='w-full px-5 flex justify-start items-center gap-2'>
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`
              text-sm text-stone-400 cursor-pointer rounded-md
              flex flex-col justify-start items-center
            `}
            onClick={() => setSelectedTab(tab)}
          >
            {(session?.lifeAuUser?.mode === 'admin' && tab === tabs[0]) ? (
              <div
                className={`
                  pb-1 duration-300 border-b-[2px] flex justify-start items-center gap-2
                  ${selectedTab === tab ? 'font-medium border-purple-500 dark:border-purple-200' : 'border-transparent'}
                `}
              >
                <div className="font-bold flex justify-start items-center gap-2 p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md duration-300">
                  <Sparkles size={18} strokeWidth={1.5} className='stroke-purple-500 dark:stroke-purple-200' />
                  <SparklesText text={tab} className='text-sm text-purple-500 dark:text-purple-200' />
                  <div className='w-5 h-5 rounded-full overflow-hidden flex justify-center items-center bg-purple-500 dark:bg-purple-200'>
                    <p className='text-xs font-semibold text-white dark:text-purple-500 rounded-full px-1'>
                      {numberOfRepositories || 0}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`
                  pb-1 duration-300 border-b-[2px]
                  ${selectedTab === tab ? 'font-medium text-black dark:text-white border-black dark:border-white' : 'border-transparent'}
                `}
              >
                <p className="px-3 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md duration-300">
                  {tab}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tabbar