import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'
import React from 'react'

const GeneralSetting = () => {

  const { data: session } = useSession()

  return (
    <div className="w-full flex flex-col justify-start items-start gap-5">
      <h1 className="text-2xl font-semibold">General</h1>
      <div className="w-full p-5 bg-white dark:bg-stone-950 rounded-md bdr cursor-pointer duration-300 flex flex-col justify-start items-start gap-2">
        <p className="text-lg font-medium">Display Name</p>
        <p className="text-sm text-stone-400 dark:text-stone-500">
          Your name will be displayed in the dashboard.
        </p>
        <Input
          defaultValue={session?.user?.name || "undefined"}
          className="disabled:opacity-80"
          disabled
        />
      </div>
      <div className="w-full p-5 bg-white dark:bg-stone-950 rounded-md bdr cursor-pointer duration-300 flex flex-col justify-start items-start gap-2">
        <p className="text-lg font-medium">Email</p>
        <p className="text-sm text-stone-400 dark:text-stone-500">
          This is your account email.
        </p>
        <Input
          defaultValue={session?.user?.email || "undefined"}
          className="disabled:opacity-80"
          disabled
        />
      </div>
    </div>
  )
}

export default GeneralSetting