import React from 'react'


const Toast = ({ show, message , type = "success" }) => {
  const typeStyles = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-500 text-black',
  };

  return (
    <div className='fixed z-50 top-10 flex justify-center items-center  h-10 ' >
      <div className={` px-6 py-3 rounded shadow-lg text-white transform transition-all duration-1000 ease-in-out ${
          show
            ? 'opacity-100 translate-y--30 pointer-events-auto '
            : 'opacity-0 -translate-y-4 pointer-events-none'
        } ${typeStyles[type]}`}
    >
        <p className='text-white font-sm' >{message}</p>

    </div>
    </div>
  )
}

export default Toast