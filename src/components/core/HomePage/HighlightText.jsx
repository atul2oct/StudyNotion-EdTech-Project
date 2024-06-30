import React from 'react'

const HighlightText = ({text}) => {
  return (
    <span className='font-bold bg-gradient-to-b from-highlight-1 via-highlight-2 to-highlight-3 text-transparent bg-clip-text'>
        {text}
    </span>
  )
}

export default HighlightText