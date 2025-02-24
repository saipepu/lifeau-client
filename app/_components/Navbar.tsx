"use client";

import { Laptop, Menu, Moon, Slash, Sun, X } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeContext } from "@/utils/hooks/themeContext";
import { getPublicProfile } from "@/app/api/profile/getPublicProfile";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const path = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { setTheme } = useContext(ThemeContext);
  const [activeTheme, setActiveTheme] = useState<string>("system");
  const [subPage, setSubPage] = useState<string>("");
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleLogout = async () => {
    localStorage.removeItem("life.au-token");
  };

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

  useEffect(() => {
    if (path.includes("overview")) {
      setSubPage(path.split("/")[path.split("/").length - 2]);
    } else {
      setSubPage(path.split("/")[path.split("/").length - 1])
    }
  }, [path]);

  const applyTheme = (theme: string) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setActiveTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "system") {
      applySystemTheme();
    } else {
      applyTheme(newTheme);
    }
  };

  const applySystemTheme = () => {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (systemPrefersDark) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  };

  return (
    <div className="relative w-full max-w-[1600px] px-5 py-4 flex justify-between items-center">
      <div className="flex justify-start items-center gap-2">
        <div
          className="flex justify-start items-center gap-2 cursor-pointer"
          onClick={() => (window.location.href = "/landing")}
        >
          <div className="relative flex justify-center items-center pl-2">
            <svg
              width="26"
              height="24"
              viewBox="0 0 32 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1251_384)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M24.488 27.5051C25.2054 28.7501 26.5345 29.5172 27.973 29.5172C31.0656 29.5172 33.0005 26.1769 31.4585 23.5002L19.1666 2.1674C17.4317 -0.843503 13.0289 -0.685387 11.5152 2.44216L1.41376 23.313C-1.47653 29.1815 0.183116 29.5172 5.31219 29.5172H8.33569C11.6661 29.5172 13.7496 25.9198 12.0884 23.0376L8.09828 16.115C6.9254 14.0801 7.62673 11.4811 9.66474 10.31C11.7028 9.13887 14.3057 9.83914 15.4786 11.874L24.488 27.5051Z"
                  fill="currentColor"
                  className="text-black dark:text-white"
                />
              </g>
              <defs>
                <clipPath id="clip0_1251_384">
                  <rect width="32" height="29.5172" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <p className="text-xl font-semibold">Life.au</p>
        </div>
        {subPage && (
          <div className="flex justify-start items-center gap-2">
            <div className="w-[1px] h-6 bg-black dark:bg-white rotate-12"></div>
            <p className="text-xl font-semibold">{subPage}</p>
          </div>
        )}
      </div>
      <div className="hidden md:flex justify-center items-center gap-2">
        {session?.lifeAuUser?.mode === "admin" && (
          <Button
            onClick={() => router.push("/dashboard/admin/all-repositories")}
            className="flex px-2 bg-transparent text-black dark:text-white hover:bg-transparent hover:text-opacity-40"
          >
            <p className="text-sm">Dashboard</p>
          </Button>
        )}
        <Button
          onClick={() => {}}
          className="flex px-2 bg-transparent text-black dark:text-white hover:bg-transparent hover:text-opacity-40"
        >
          <p className="text-sm">Feedback</p>
        </Button>
        <Button
          onClick={() => {}}
          className="flex px-2 bg-transparent text-black dark:text-white hover:bg-transparent hover:text-opacity-40"
        >
          <p className="text-sm">Help</p>
        </Button>
        <div className="flex justify-end items-center gap-2">
          {session?.lifeAuUser?.mode === "admin" && (
            <div className="mr-auto px-3 rounded-md bg-purple-200 dark:bg-purple-500 flex justify-center items-center">
              <p className="text-sm font-medium text-purple-500 dark:text-purple-200 font-mono">
                Admin
              </p>
            </div>
          )}
          <div className="flex justify-start items-center gap-2">
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm outline-none flex justify-start items-center gap-2 dark:border-transparent rounded-md px-2 py-1 cursor-pointer">
                  {session?.user?.name}
                  <div className="w-4 h-4 rounded-full overflow-hidden">
                    <img
                      src={
                        session?.user?.image ||
                        "https://via.placeholder.com/150"
                      }
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push("/dashboard/profile/general")}
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        handleLogout();
                        signOut({ redirectTo: "/landing" });
                      }}
                    >
                      <div className="w-full text-red-200 text-sm cursor-pointerrounded-md">
                        Logout
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div
                className="px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md"
                onClick={() => signIn("github")}
              >
                Login
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm outline-none flex justify-start items-center gap-2 border dark:border-transparent rounded-md px-2 py-1">
              {activeTheme === "dark" && <Moon size={18} strokeWidth={1.5} />}
              {activeTheme === "light" && <Sun size={18} strokeWidth={1.5} />}
              {activeTheme === "system" && (
                <Laptop size={18} strokeWidth={1.5} />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={activeTheme}
                onValueChange={(value) => handleThemeChange(value)}
              >
                <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="light">
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Button
        className="z-50 w-10 h-10 md:hidden bg-transparent bdr p-0 hover:bg-transparent"
        onClick={() => setShowMenu(!showMenu)}
      >
        {showMenu ? (
          <X
            size={24}
            strokeWidth={1.5}
            className="stroke-black dark:stroke-white"
          />
        ) : (
          <Menu
            size={24}
            strokeWidth={1.5}
            className="stroke-black dark:stroke-white"
          />
        )}
      </Button>

      {/* menu */}
      <div
        className="p-5 absolute top-0 left-0 w-full h-[100vh] bg-white dark:bg-stone-950 dark:border-stone-700 border-b z-30 flex flex-col justify-start items-start gap-3"
        style={{ display: showMenu ? "flex" : "none" }}
      >
        {session?.user && (
          <div className="w-full h-10 flex justify-start items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src={session?.user?.image || "https://via.placeholder.com/150"}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xl">{session?.user?.name}</p>
            <div className="flex justify-start items-center gap-2">
              {session?.lifeAuUser?.mode === "admin" && (
                <div className="px-3 rounded-md bg-purple-200 dark:bg-purple-500 flex justify-center items-center">
                  <p className="text-sm font-medium text-purple-500 dark:text-purple-200 font-mono">
                    Admin
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        <Button
          onClick={() => {
            router.push("/dashboard/profile/my-projects");
            setShowMenu(false)
          }}
          className="flex p-0 bg-transparent text-black dark:text-white hover:bg-transparent hover:text-opacity-80"
        >
          <p className="text-sm">Profile</p>
        </Button>
        {session?.lifeAuUser?.mode === "admin" && (
          <Button
            onClick={() => {
              router.push("/dashboard/admin/all-repositories")
              setShowMenu(false)
            }}
            className="flex p-0 bg-transparent text-black dark:text-white hover:bg-transparent hover:text-opacity-80"
          >
            <p className="text-sm">Dashboard</p>
          </Button>
        )}
        <Button
          onClick={() => setShowMenu(false)}
          className="flex p-0 bg-transparent text-black dark:text-white hover:bg-transparent hover:text-opacity-80"
        >
          <p className="text-sm">Feedback</p>
        </Button>
        <Button
          onClick={() => setShowMenu(false)}
          className="flex p-0 bg-transparent text-black dark:text-white hover:bg-transparent hover:text-opacity-80"
        >
          <p className="text-sm">Help</p>
        </Button>
        {session?.user ? (
          <Button
            onClick={() => {
              handleLogout();
              signOut({ redirectTo: "/landing" });
            }}
            className="flex p-0 bg-transparent text-black dark:text-white hover:bg-transparent hover:text-opacity-80"
          >
            <p className="text-sm">Logout</p>
          </Button>
        ) : (
          <Button
            onClick={() => {
              signIn("github");
            }}
            className="flex p-0 bg-transparent text-black dark:text-white hover:bg-transparent hover:text-opacity-80"
          >
            <p className="text-sm">Login</p>
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className="w-10 h-10 text-sm outline-none flex justify-center items-center gap-2 border dark:border-gray-400 rounded-md px-2 py-1">
            {activeTheme === "dark" && <Moon size={18} strokeWidth={1.5} />}
            {activeTheme === "light" && <Sun size={18} strokeWidth={1.5} />}
            {activeTheme === "system" && <Laptop size={18} strokeWidth={1.5} />}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={activeTheme}
              onValueChange={(value) => handleThemeChange(value)}
            >
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
