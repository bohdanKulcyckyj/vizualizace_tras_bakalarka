import { useEffect } from 'react'
import { useMainContext } from '../context/MainContext'

const Loading = () => {
  const { isLoading } = useMainContext()

  useEffect(() => {
    if (isLoading) {
      document.body.classList.add('overflow-y-hidden')
    } else {
      document.body.classList.remove('overflow-y-hidden')
    }
  }, [isLoading])

  return (
    <div
      className={`component-loading ${isLoading ? 'component-loading--active' : ''}`}
    >
      <div className='component-loading__container'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default Loading
