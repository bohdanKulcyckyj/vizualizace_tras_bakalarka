import React, { useState } from 'react'
import { Children } from '../../interfaces/ContextProvider'
import { IconContext } from 'react-icons'
import { MdKeyboardArrowRight } from 'react-icons/md'

const Toolbar = ({ children }: Children) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className='toolbar'>
      <div
        className={`toolbar__container ${isOpen ? 'toolbar__container--opened' : ''}`}
      >
        <div className='toolbar__content h-[70vh] mt-8'>{children}</div>
      </div>
      <div className='toolbar__arrow-panel'>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className='toolbar__arrow-container'
        >
          <IconContext.Provider
            value={{
              className: `toolbar__arrow ${isOpen ? 'toolbar__arrow--opened' : ''}`,
            }}
          >
            <MdKeyboardArrowRight />
          </IconContext.Provider>
        </div>
      </div>
    </div>
  )
}

export default Toolbar
