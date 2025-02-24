import React from "react";
import { differenceInDays } from "date-fns";

const RepoCard = ({ container, adminView }: { container: any, adminView: boolean }) => {
  return (
    <div className="p-5 bg-white dark:bg-stone-950 rounded-md bdr cursor-pointer duration-300 hover:bg-stone-100 hover:dark:bg-stone-900">
      <div className="w-full flex flex-col justify-between items-center gap-2">
        {adminView && 
          <div className="w-full flex justify-start items-center gap-2">
            <p className="text-lg font-semibold">{container?.githubUrl.split('/')[3]}</p>
          </div>
        }
        <div className="w-full flex justify-start items-center gap-2">
          <div className="w-fit rounded-md flex justify-center items-center">
            <svg
              width="14"
              height="12"
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
          <p className="text-sm font-medium">{container?.name}</p>
          <div className={`
            font-semibold p-1 px-2 ml-auto text-xs rounded-full
            ${container?.status === "READY" && "text-green-500 bg-green-200 dark:opacity-90"}
            ${container?.status === "DEPLOYED" && "text-purple-500 bg-purple-200 dark:opacity-90"}
            ${container?.status === "PENDING" && "text-yellow-500 bg-yellow-200 dark:opacity-90"}
            ${container?.status === "FAILED" && "text-red-500 bg-red-200 dark:opacity-90"}
            `}>
            {container?.status}
          </div>
        </div>
        <div className="w-full flex flex-col justify-start items-start">
          <div className="w-fit p-1 px-2 rounded-full flex justify-center items-center gap-1 bg-stone-100 dark:bg-stone-800">
            <div className="w-4 h-4 rounded-full flex justify-center items-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1257_402)">
                <path d="M10 0C8.68678 0 7.38642 0.258658 6.17317 0.761205C4.95991 1.26375 3.85752 2.00035 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 14.42 2.87 18.17 6.84 19.5C7.34 19.58 7.5 19.27 7.5 19V17.31C4.73 17.91 4.14 15.97 4.14 15.97C3.68 14.81 3.03 14.5 3.03 14.5C2.12 13.88 3.1 13.9 3.1 13.9C4.1 13.97 4.63 14.93 4.63 14.93C5.5 16.45 6.97 16 7.54 15.76C7.63 15.11 7.89 14.67 8.17 14.42C5.95 14.17 3.62 13.31 3.62 9.5C3.62 8.39 4 7.5 4.65 6.79C4.55 6.54 4.2 5.5 4.75 4.15C4.75 4.15 5.59 3.88 7.5 5.17C8.29 4.95 9.15 4.84 10 4.84C10.85 4.84 11.71 4.95 12.5 5.17C14.41 3.88 15.25 4.15 15.25 4.15C15.8 5.5 15.45 6.54 15.35 6.79C16 7.5 16.38 8.39 16.38 9.5C16.38 13.32 14.04 14.16 11.81 14.41C12.17 14.72 12.5 15.33 12.5 16.26V19C12.5 19.27 12.66 19.59 13.17 19.5C17.14 18.16 20 14.42 20 10C20 8.68678 19.7413 7.38642 19.2388 6.17317C18.7362 4.95991 17.9997 3.85752 17.0711 2.92893C16.1425 2.00035 15.0401 1.26375 13.8268 0.761205C12.6136 0.258658 11.3132 0 10 0Z"
                  fill='currentColor'
                  className="text-dark dark:text-white"
                />
                </g>
                <defs>
                <clipPath id="clip0_1257_402">
                <rect width="20" height="19.5155" fill="white"/>
                </clipPath>
                </defs>
              </svg>
            </div>
            <a href={container?.githubUrl} className="hover:underline duration-300 text-xs font-medium text-black dark:text-white">{container?.githubUrl.split('/').splice(-2,2).join('/')}</a>
          </div>
        </div>
        <div className="w-full flex flex-col justify-start items-start gap-1">
          <p className="text-xs font-normal">{differenceInDays(new Date(), new Date(container?.updatedAt))}d ago</p>
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
