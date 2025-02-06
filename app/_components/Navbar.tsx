"use client";

import { Laptop, Moon, Sun } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeContext } from '@/utils/hooks/themeContext';
import { getPublicProfile } from '@/app/api/profile/getPublicProfile';
import { signIn, signOut, useSession } from 'next-auth/react';

const Navbar = () => {

  const [activeTheme, setActiveTheme] = useState<string>('system');
  const { theme, setTheme } = useContext(ThemeContext)
  const [user, setUser] = useState<any>(null)
  const { data: session } = useSession()
  console.log(session, 'session')

  const handleLogout = async () => {
    localStorage.removeItem('life.au-token')
  }

  useEffect(() => {

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "system" || !savedTheme) {
      applySystemTheme();
      setActiveTheme("system");
    } else {
      applyTheme(savedTheme);
      setActiveTheme(savedTheme);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (!savedTheme || savedTheme === "system") {
        applySystemTheme();
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const applyTheme = (theme: string) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setActiveTheme(newTheme)
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'system') {
      applySystemTheme();
    } else {
      applyTheme(newTheme);
    }
  };

  const applySystemTheme = () => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemPrefersDark) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }

  return (
    <div className='w-full max-w-[1500px] px-5 py-2 flex justify-between items-center'>
      <div
        className='flex justify-start items-center gap-2 cursor-pointer'
        onClick={() => window.location.href = '/landing'}
      >
        <div className='relative flex justify-center items-center'>
          <svg width="26" height="24" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1251_384)">
            <path fillRule="evenodd" clipRule="evenodd" d="M24.488 27.5051C25.2054 28.7501 26.5345 29.5172 27.973 29.5172C31.0656 29.5172 33.0005 26.1769 31.4585 23.5002L19.1666 2.1674C17.4317 -0.843503 13.0289 -0.685387 11.5152 2.44216L1.41376 23.313C-1.47653 29.1815 0.183116 29.5172 5.31219 29.5172H8.33569C11.6661 29.5172 13.7496 25.9198 12.0884 23.0376L8.09828 16.115C6.9254 14.0801 7.62673 11.4811 9.66474 10.31C11.7028 9.13887 14.3057 9.83914 15.4786 11.874L24.488 27.5051Z" fill='currentColor'
              className="text-black dark:text-white"
            />
            </g>
            <defs>
            <clipPath id="clip0_1251_384">
            <rect width="32" height="29.5172" fill="white"/>
            </clipPath>
            </defs>
          </svg>
        </div>
        <p className="text-xl font-semibold">Life.au</p>
      </div>
      <div className='flex justify-center items-center gap-2'>
        <div className='flex justify-end items-center gap-2'>
          <div className='flex justify-start items-center gap-2'>
            {session?.user ?
              <DropdownMenu>
                <DropdownMenuTrigger className='text-sm outline-none flex justify-start items-center gap-2 dark:border-transparent rounded-md px-2 py-1 cursor-pointer'>
                  {session?.user?.name}
                  <div className='w-4 h-4 rounded-full overflow-hidden'>
                    <img src={session?.user?.image || ''} alt="profile" className='w-full h-full object-cover' />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem className='cursor-pointer'>Profile</DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer' onClick={() => {
                      handleLogout()
                      signOut({ redirectTo: '/landing'})
                    }}>
                      <div
                        className='w-full text-red-200 text-sm cursor-pointerrounded-md'>
                        Logout
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              :
              <div
                className='px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md'
                onClick={() => signIn('github') }
              >
                Login
              </div>
            }
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className='text-sm outline-none flex justify-start items-center gap-2 border dark:border-transparent rounded-md px-2 py-1'>
              {activeTheme === 'dark' && <Moon size={18} strokeWidth={1.5} />}
              {activeTheme === 'light' && <Sun size={18} strokeWidth={1.5} />}
              {activeTheme === 'system' && <Laptop size={18} strokeWidth={1.5}/>}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={activeTheme} onValueChange={(value) => handleThemeChange(value)}>
                <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default Navbar