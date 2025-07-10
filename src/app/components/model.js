import React from 'react'

function Model() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Model Title</h2>
            <p className="text-gray-700 mb-6">This is a simple model dialog. You can put any content here.</p>
            <div className="flex justify-end">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                    Close
                </button>
            </div>
        </div>
    </div>

  )
}

export default Model