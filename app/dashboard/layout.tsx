"use client";
import React from 'react'
import Footer from '../_components/Footer'
import Navbar from '../_components/Navbar'
import Tabbar from '../_components/Tabbar'

const layout = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [selectedTab, setSelectedTab] = React.useState('Repositories')

  return (
    <div className='w-full min-h-full h-full bg-stone-100 dark:bg-black overflow-hidden overflow-y-scroll flex flex-col justify-start items-center'>
      
      <div className='w-full flex flex-col justify-start items-center gap-1 bg-white dark:bg-stone-950'>
        <Navbar />
      </div>

      <div className='w-full flex-1 flex flex-col justify-start items-center bg-transparent pb-10'>
        {children}
      </div>

      <Footer />

    </div>
  )
}

export default layout