import React from 'react'

function Model({ onClose, onDelete }) {


  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-950/70 flex items-center justify-center z-50">
        <div className="bg-[#424242] p-6 rounded-lg shadow-lg max-w-md w-full">
            <h4 className="text-2xl font-bold mb-4">Delete chat</h4>
            <p className="text-stroke-700 mb-6">Are you sure you want to delete this chat?</p>
            <div className="flex justify-end space-x-4">
                <button className="btn relative btn-secondary py-2 px-4 border border-gray-300  rounded-3xl cursor-pointer" onClick={onClose}> 
                    Close
                </button>
                 <button className="btn relative btn-danger bg-red-500  py-2 px-4 rounded-3xl cursor-pointer text-white hover:bg-red-600" onClick={onDelete}>
                    Delete
                </button>
            
            </div>
        </div>
    </div>

  )
}

export default Model