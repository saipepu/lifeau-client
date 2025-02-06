"use client"
import React from 'react'

const Tabbar = ({
  selectedTab,
  setSelectedTab,
  tabs
}: {
  selectedTab: string,
  setSelectedTab: (tab: string) => void,
  tabs: string[]
}) => {

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
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tabbar