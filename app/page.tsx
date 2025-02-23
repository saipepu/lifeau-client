"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  // const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // const token = searchParams.get("token");
    // if (token) {
    //   localStorage.setItem("life.au-token", token);
    // }
    const timer = setTimeout(() => {
      router.push("/landing");
    }, 1000);
    return () => clearTimeout(timer);
  }, [])

  return (
    <div className="relative w-full h-full flex flex-col justify-start items-center p-5">

      {/* redirecting */}
      <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-black flex justify-center items-center">
        <div className="absolute w-14 h-14  border-dashed border border-black rounded-full animate-ping"></div>
        <div className="absolute w-14 h-14  border-dashed border border-black rounded-full animate-spin"></div>
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
      </div>

    </div>
  );
}
