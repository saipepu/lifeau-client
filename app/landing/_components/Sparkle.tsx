"use client";
import React, { useContext, useEffect, useState } from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { ThemeContext } from "@/utils/hooks/themeContext";

export function SparklesPreview() {

  const [particleColor, setParticleColor] = useState<string>('');
  const { theme, setTheme } = useContext(ThemeContext);
  console.log(theme);

  useEffect(() => {
    if(theme === "dark") {
      setParticleColor('#FFFFFF');
    } else if(theme === "light") {
      setParticleColor('#000000');
    } else if(theme === "system") {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        setParticleColor('#FFFFFF');
      } else {
        setParticleColor('#000000');
      }
    }
  }, [theme])

  return (
    <div className="h-[40rem] w-fullflex flex-col items-center justify-center rounded-md">
      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-md" />
        <div className="absolute inset-x-20 top-0 left-[50%] -translate-x-[50%] bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-2/4 md:w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor={particleColor}
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-stone-100 dark:bg-black [mask-image:radial-gradient(350px_150px_at_top,transparent_40%,white)]"></div>
      </div>
    </div>
  );
}
