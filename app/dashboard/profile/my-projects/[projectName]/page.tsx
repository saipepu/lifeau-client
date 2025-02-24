"use client";

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const page = () => {

  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    let endPoint = path.split("/")[path.split("/").length - 1];
    router.push(`/dashboard/profile/my-projects/${endPoint}/overview`)
  }, [])

  return (
    <>
    </>
  )
}

export default page