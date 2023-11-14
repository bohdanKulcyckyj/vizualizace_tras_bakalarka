import React, { useState } from 'react'
import { Children } from '../../interfaces/IContextProvider'
import { IconContext } from 'react-icons';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";

const Toolbar = ({children} : Children) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex">
      <div className={`toolbar__container ${isOpen ? "toolbar__container--opened" : ""}`}>
        <div className="toolbar__content">
          {children}
        </div>
      </div>
      <div className="toolbar__arrow-panel">
        <div onClick={() => setIsOpen(!isOpen)} className="toolbar__arrow-container">
          <IconContext.Provider
            value={{ className: `toolbar__arrow ${isOpen ? "toolbar__arrow--opened" : ""}` }}>
              <MdKeyboardArrowRight />
          </IconContext.Provider>
        </div>
      </div>
    </div>
  )
}

export default Toolbar