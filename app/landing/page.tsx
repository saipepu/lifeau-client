"use client";

import React from 'react'
import Navbar from '../_components/Navbar'
import { AnimatedBeamDemo } from './_components/AnimatedDiagram'
import { Button } from '@/components/ui/button'
import { SparklesPreview } from './_components/Sparkle'
import { ThemeContext } from '@/utils/hooks/themeContext';
import Footer from '../_components/Footer';

const Landing = () => {

  const [theme, setTheme] = React.useState('light');

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme
      }}
    >
      <div className='w-full min-h-full h-full bg-stone-100 dark:bg-black overflow-hidden overflow-y-scroll flex flex-col justify-start items-center'>
        
        <div className='w-full max-w-[1200px] flex flex-col justify-start items-center gap-10'>
          <Navbar />
          <div className="relative z-10 w-full max-w-[1000px] flex flex-col items-center justify-center gap-2">
            <div className="w-full flex justify-center items-center pt-40">
              <div className="relative w-full flex flex-col justify-start items-center">
                <p className="text-6xl font-semibold text-center">Steamline Your Deployment<br /> With Life.au</p>
                <div className="absolute top-[100%] w-full flex justify-center items-center">
                  <SparklesPreview />
                </div>
              </div>
            </div>
            <p className="z-20 max-w-[60%] text-sm md:text-base text-center mt-28 leading-none tracking-tight">
              Deploy smarter and faster with Life.au. Our platform ensures effortless efficiency, helping you save time and reduce complexity, so you can focus on what truly matters.
            </p>
            <Button
              onClick={() => window.location.href = "/dashboard"}
              className="z-20 rounded-full bg-black dark:bg-white"
            >
              <div className='relative flex justify-center items-center'>
                <svg width="26" height="24" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1251_384)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M24.488 27.5051C25.2054 28.7501 26.5345 29.5172 27.973 29.5172C31.0656 29.5172 33.0005 26.1769 31.4585 23.5002L19.1666 2.1674C17.4317 -0.843503 13.0289 -0.685387 11.5152 2.44216L1.41376 23.313C-1.47653 29.1815 0.183116 29.5172 5.31219 29.5172H8.33569C11.6661 29.5172 13.7496 25.9198 12.0884 23.0376L8.09828 16.115C6.9254 14.0801 7.62673 11.4811 9.66474 10.31C11.7028 9.13887 14.3057 9.83914 15.4786 11.874L24.488 27.5051Z" fill='currentColor'
                    className="text-white dark:text-black"
                  />
                  </g>
                  <defs>
                  <clipPath id="clip0_1251_384">
                  <rect width="32" height="29.5172" fill="white"/>
                  </clipPath>
                  </defs>
                </svg>
              </div>
              <p className="text-sm">Start Deploying</p>
            </Button>
          </div>

          <div className="w-full flex flex-col justify-start items-center gap-5 py-20">
            <p className="text-4xl font-semibold text-center">How it works</p>
            <AnimatedBeamDemo />
            <p className="z-20 max-w-[60%] text-sm md:text-base text-center leading-none tracking-tight">
              Life.au simplifies your workflow with an intuitive process: integrate your tools, streamline deployment, and manage everything in one place.
            </p>
          </div>

          <Footer />
        </div>

      </div>
    </ThemeContext.Provider>
  )
}

export default Landing