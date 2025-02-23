import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import { switchToAdminMode } from '@/app/api/user/switchToAdminMode'
import { switchToUserMode } from '@/app/api/user/switchToUserMode'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'

const AccountSetting = () => {

  const { data: session } = useSession()

  const handleLogout = async () => {
    localStorage.removeItem('life.au-token')
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
            <ActivationAlertModel handleLogout={handleLogout} mode="user"/>
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
            <ActivationAlertModel handleLogout={handleLogout} mode="admin"/>
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

const ActivationAlertModel = ({
  handleLogout,
  mode
}: {
  handleLogout: () => void,
  mode: string
}) => {

  const { data: session } = useSession()
  const [secret, setSecret] = React.useState('')
  const [isSecretVisible, setIsSecretVisible] = React.useState(false)
  const [isSecretValid, setIsSecretValid] = React.useState(false)
  const [isSecretError, setIsSecretError] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSwitchMode = async ({ mode } : { mode: string}) => {
    console.log(secret)
    if(secret.length < 6) {
      setIsSecretError(true)
      return
    }
    let dto = {
      userId: session?.lifeAuUser._id,
      secret: secret
    }
    let response = null
    if(mode === "admin") {
      response = await switchToAdminMode(dto)  
    } else {
      response = await switchToUserMode(dto)
    }

    if(response.success) {
      console.log(response);
      handleLogout()
      signOut({ redirectTo: '/landing'})
      setIsOpen(false)
    } else {
      console.log(response.message, "response.message")
      setIsSecretError(true)
    }
  }

  return (
    <AlertDialog open={isOpen} >
      <AlertDialogTrigger asChild>
        <Button className="px-4 h-full w-[100px] bg-transparent border-l-2 flex justify-start items-center hover:bg-stone-200 hover:dark:bg-stone-500 rounded-none duration-300" onClick={() => setIsOpen(true)}>
          <p className="text-base font-semibold text-stone-500 dark:text-stone-200">
            Activate
          </p>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>🔑 Ready to activate the "User" mode?</AlertDialogTitle>
          <div className='w-full flex flex-col justify-start items-start gap-2'>
            <p className="text-sm text-stone-500 dark:text-stone-200">
              You will be logout after the activation and will have to login again.
            </p>
            <p className="text-lg font-semibold mt-5 text-black dark:text-white">
              Enter your secret key to confirm the action.
            </p>
            <div className="w-full flex justify-start items-center gap-2">
              <Input
                type={isSecretVisible ? 'text' : 'password'}
                className={`bg-white dark:bg-stone-950 bg-transparent ${isSecretError ? 'border-red-500' : 'border-input'} border rounded-md h-10 px-3`}
                placeholder="••••••"
                value={secret}
                onChange={(e) => {
                  setSecret(e.target.value)
                  setIsSecretError(false)
                  setIsSecretValid(e.target.value.length > 5)
                }}
                autoComplete='nope'
              />
              {isSecretVisible ? (
                <Eye
                  size={20}
                  className='cursor-pointer'
                  onClick={() => setIsSecretVisible(!isSecretVisible)}
                />
              ) : (
                <EyeOff
                  size={20}
                  className='cursor-pointer'
                  onClick={() => setIsSecretVisible(!isSecretVisible)}
                />
              )}
            </div>
            <p className="text-sm text-red-500 dark:text-red-400">
              {isSecretError ? 'Invalid secret key.' : ''}
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-200">
              {isSecretValid ? '' : 'Secret key must be at least 6 characters.'}
            </p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='h-8' onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className='className="p-2 bg-green-500 dark:text-white font-semibold h-8 rounded-md flex justify-center items-center'
            onClick={() => {
              handleSwitchMode({ mode: mode })
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AccountSetting