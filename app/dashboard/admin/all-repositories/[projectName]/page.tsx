"use client";

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const page = () => {

  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    let endPoint = path.split("/")[path.split("/").length - 1];
    router.push(`/dashboard/admin/all-repositories/${endPoint}/overview`)
  }, [])

  return (
    <>
    </>
  )
}

export default page