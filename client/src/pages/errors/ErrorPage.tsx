import { Link } from 'react-router-dom'

type TProps = {
    errorCode: number,
    subheading: string,
    link: string,
    linkText: string
}

const ErrorPage = ({errorCode, subheading, link, linkText}: TProps) => {
  return (
    <div className='error-page'>
      <div className='flex flex-col'>
        <h1>{errorCode}</h1>
        <p className='text-center mb-6'>{subheading}</p>
        <div className='flex justify-center'>
          <Link to={link}>
            <button className='primary-button'>{linkText}</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
