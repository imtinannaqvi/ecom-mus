import React from 'react'

function Button({text}) {
  return (
    // Reusable button component with black background and white text
    <button className='px-6 py-2 bg-black text-white'>{text}</button>
  )
}

export default Button