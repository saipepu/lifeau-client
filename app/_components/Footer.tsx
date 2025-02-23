import React from 'react'

const Footer = () => {

  const NavLinks = [
    {
      title: 'Home',
      link: '/'
    },
    {
      title: 'About',
      link: '/about'
    },
    {
      title: 'Contact',
      link: '/contact'
    }
  ]

  return (
    <div className='w-full bdr border-0 border-t flex flex-col justify-start items-center'>
      <div className='w-full max-w-[1600px] p-5 flex justify-center items-start gap-2'>
        <div className='w-full flex justify-start items-center gap-4'>
          <div className='flex justify-center items-center'>
            <svg width="14" height="12" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          {NavLinks.map((link, index) => {
            return (
              <a href={link.link} key={index} className='text-xs text-stone-400 hover:text-black dark:hover:text-white'>
                {link.title}
              </a>
            )
          })}
        </div>
        <p className='text-xs text-stone-400 whitespace-nowrap'>© 2025 Life.au by PePu & JuzBird</p>
      </div>
    </div>
  )
}

export default Footer