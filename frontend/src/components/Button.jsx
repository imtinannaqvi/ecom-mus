import { buildProjectionTransform } from 'framer-motion'
import React from 'react'

function Button({text}) {
  return (
    <button className='px-6 py-2 bg-black text-white'>{text}</button>
  )
}

export default Button