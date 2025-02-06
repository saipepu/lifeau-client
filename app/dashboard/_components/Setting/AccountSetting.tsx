import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import { switchToAdminMode } from '@/app/api/user/switchToAdminMode'
import { switchToUserMode } from '@/app/api/user/switchToUserMode'
import React from 'react'

const AccountSetting = () => {

  const { data: session } = useSession()

  const handleLogout = async () => {
    localStorage.removeItem('life.au-token')
  }


  const handleSwitchMode = async ({ mode } : { mode: string}) => {
    console.log('handleSwitchMode', mode);
    let dto = {
      userId: session?.lifeAuUser._id,
      secret: 'chayapol@life-au.live'
    }
    let response = null
    if(mode === "admin") {
      response = await switchToAdminMode(dto)  
    } else {
      response = await switchToUserMode(dto)
    }

    if(response.success) {
      console.log(response);
    } else {
      console.log(response.message, "response.message")
    }
  }

  return (
    <div className="w-full flex flex-col gap-2 justify-start items-start">
      <h1 className="text-2xl font-semibold">Account</h1>
      <div className="w-full p-5 bg-white dark:bg-stone-950 rounded-md bdr cursor-pointer duration-300 flex flex-col justify-start items-start gap-2">
        <p className="text-lg font-medium">Your accounts</p>
        <p className="text-sm text-stone-400 dark:text-stone-500">
          These are your linked accounts. And they have specific role.
          Contact developer to activate the admin account.
        </p>

        <div className="flex h-10 w-full rounded-md border border-input bg-background text-base md:text-sm justify-between items-center overflow-hidden">
          <p className="text-base font-semibold px-3 py-2">
            {session?.user?.name || undefined}
          </p>
          {session?.lifeAuUser?.mode === 'admin' ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="px-4 h-full w-[100px] bg-transparent border-l-2 flex justify-start items-center hover:bg-stone-200 hover:dark:bg-stone-500 rounded-none duration-300">
                  <p className="text-base font-semibold text-stone-500 dark:text-stone-200">
                    Activate
                  </p>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>🔑 Ready to activate the "User" mode?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be logout after the activation and will have to login again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className='h-8'>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className='className="p-2 bg-green-500 dark:text-white font-semibold h-8 rounded-md flex justify-center items-center'
                    onClick={() => {
                      handleSwitchMode({ mode: "user" })
                      handleLogout()
                      signOut({ redirectTo: '/landing'})
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <div className="mr-2 px-3 rounded-md bg-green-500  flex justify-center items-center">
              <p className="text-base font-semibold text-white dark:text-stone-200">
                Active
              </p>
            </div>
          )}
        </div>

        <div className="flex h-10 w-full rounded-md border border-input bg-background text-base md:text-sm justify-between items-center overflow-hidden">
          <p className="text-base font-semibold px-3 py-2">
            {session?.user?.name || undefined}
          </p>
          <div className="mr-auto px-3 rounded-md bg-stone-200 dark:bg-stone-500 flex justify-center items-center">
            <p className="text-base font-semibold text-stone-500 dark:text-stone-200">
              Admin
            </p>
          </div>
          {session?.lifeAuUser?.mode === 'user' ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
              <Button className="px-4 h-full w-[100px] bg-transparent border-l-2 flex justify-start items-center hover:bg-stone-200 hover:dark:bg-stone-500 rounded-none duration-300">
                  <p className="text-base font-semibold text-stone-500 dark:text-stone-200">
                    Activate
                  </p>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>🔑 Ready to activate the "Admin" mode?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be logout after the activation and will have to login again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className='h-8'>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className='className="p-2 bg-green-500 dark:text-white font-semibold h-8 rounded-md flex justify-center items-center'
                    onClick={() => {
                      handleSwitchMode({ mode: "admin" })
                      handleLogout()
                      signOut({ redirectTo: '/landing'})
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <div className="mr-2 px-3 rounded-md bg-green-500  flex justify-center items-center">
              <p className="text-base font-semibold text-white dark:text-stone-200">
                Active
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="w-full p-5 bg-white dark:bg-stone-950 rounded-md bdr cursor-pointer duration-300 flex flex-col justify-start items-start gap-2">
        <p className="text-lg font-medium text-red-400">Danger Zone</p>
        <p className="text-sm text-stone-400 dark:text-stone-500">
          Be careful with this section. The action are irreversible.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="p-2 bg-red-500 h-8 rounded-md flex justify-center items-center">
              <p className="text-sm text-white whitespace-nowrap">
                Sign Out
              </p>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>⚠️ Logout Alert!</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to logout. You will be redirected to the landing page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className='h-8'>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className='className="p-2 bg-red-500 dark:bg-red-200 h-8 rounded-md flex justify-center items-center"'
                onClick={() => {
                  handleLogout()
                  signOut({ redirectTo: '/landing'})
                }}
              >
                SignOut
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default AccountSetting