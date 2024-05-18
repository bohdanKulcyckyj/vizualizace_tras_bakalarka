import { useEffect, useState } from 'react'
import defaultProfileImage from '../../assets/images/profile.png'
import { useForm } from 'react-hook-form'
import { IProfileForm } from '../../interfaces/Form'
import { Link } from 'react-router-dom'
import apiEndpoints from '../../constants/apiEndpoints'
import { toast } from 'sonner'
import { axiosWithAuth } from '../../utils/axiosWithAuth'

const ProfileForm = () => {
  const [data, setData] = useState<any>({})
  const [fieldsDisabled, setFieldsDisabled] = useState<boolean>(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProfileForm>()

  const sendData = (data) => {
    axiosWithAuth
      .post(apiEndpoints.updateUserDetail("1"), data)
      .then((res) => {
        console.log(res)
        toast.success('Your profile was successfully changed!')
      })
      .catch((err) => {
        console.error(err)
        toast.error('Something went wrong. Try again!')
      })
  }

  useEffect(() => {
    axiosWithAuth
      .get(apiEndpoints.getUserDetail("1"))
      .then((res) => setData({ ...res.data }))
      .catch((err) => console.error(err))
  }, [])

  return (
    <div className='profile__container'>
      <form className='form' onSubmit={handleSubmit(sendData)}>
        <div className='profile__image-container mb-6'>
          <img src={defaultProfileImage} alt='WanderMap3d - profile image' />
        </div>
        <div className='mb-4 form__input'>
          <input
            className={`${errors.name ? 'mb-1' : 'mb-0'}`}
            placeholder='Name'
            type='text'
            disabled={fieldsDisabled}
            {...register('name', {
              required: 'Name is required',
            })}
          />
          {errors.name && (
            <p className='h-5 text-left mt-1 err'>{errors.name.message}</p>
          )}
        </div>
        <div className='mb-4 form__input'>
          <input
            className={`${errors.email ? 'mb-1' : 'mb-0'}`}
            placeholder='Email'
            type='text'
            disabled={fieldsDisabled}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email format',
              },
            })}
          />
          {errors.email && (
            <p className='h-5 text-left mt-1 err'>{errors.email.message}</p>
          )}
        </div>
        <div
          className="transition-all flex gap-6 flex-wrap mt-10"
        >
          {fieldsDisabled ? (
            <button
              onClick={(e) => {
                e.preventDefault()
                setFieldsDisabled(false)
              }}
              className='primary-button'
            >
              Change
            </button>
          ) : (
            <>
              <button type='submit' className='primary-button'>
                Save
              </button>
              <Link to='/forgotten-password' className='secondary-button'>
                Change password
              </Link>
            </>
          )}
        </div>
      </form>
    </div>
  )
}

export default ProfileForm
