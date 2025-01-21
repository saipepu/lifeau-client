"use client";

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { ConfettiRef } from '@/components/ui/confetti';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ProjectUploadForm from './ProjectUploadForm';


const Searchbar = () => {

  return (
    <div className='w-full p-5 flex justify-start items-center gap-4'>
      <div className='p-2 h-10 flex-1 flex justify-start items-center gap-2 rounded-md bg-white dark:bg-stone-950 border bdr'>
        <Search size={16} stroke='gray' />
        <Input placeholder='Search Repositories...' className='border-none p-0 h-full placeholder-gray' />
      </div>
      <div className='flex justify-start items-center'>
        <ProjectUploadForm />
      </div>
    </div>
  )
}

export default Searchbar