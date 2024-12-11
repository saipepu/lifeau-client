import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React from 'react'

const Searchbar = () => {
  return (
    <div className='w-full p-5 flex justify-start items-center gap-4'>
      <div className='w-full p-2 h-10 flex justify-start items-center gap-2 rounded-md bg-white dark:bg-stone-950 border bdr'>
        <Search size={16} stroke='gray' />
        <Input placeholder='Search Repositories...' className='border-none p-0 h-full placeholder-gray' />
      </div>
      <Button className='p-2 bg-black dark:bg-white h-10 rounded-md flex justify-center items-center'>
        <p className='text-sm text-white dark:text-black whitespace-nowrap'>New Project</p>
      </Button>
    </div>
  )
}

export default Searchbar