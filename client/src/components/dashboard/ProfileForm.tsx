import { useEffect, useState } from 'react'
import defaultProfileImage from '../../assets/images/profile.png'
import { useForm } from 'react-hook-form'
import { IProfileForm } from '../../interfaces/Form'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useMainContext } from '../../context/MainContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getUserProfile, updateUserProfile } from '../../api/users'
import { ILoggedUser } from '../../interfaces/User'

const ProfileForm = () => {
  const [fieldsDisabled, setFieldsDisabled] = useState<boolean>()
  const { setLoggedUser } = useMainContext()
  const { userId } = useParams()
  const queryClient = useQueryClient()
  // get user profile
  const { data } = useQuery({
    queryFn: () => getUserProfile(userId),
    queryKey: ['userProfile'],
  })
  // update user profile
  const { mutateAsync: handleUpdateProfile } = useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string
      data: ILoggedUser
    }) => updateUserProfile(userId, data),
    onSuccess: (data) => {
      setLoggedUser(data)
      toast.success('Your profile was successfully changed!')
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
    },
    onError: () => toast.error('Something went wrong. Try again!'),
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IProfileForm>()

  useEffect(() => {
    if (data) {
      setValue('email', data?.email ?? '')
      setValue('name', data?.name ?? '')
    }
  }, [data, setValue])

  return (
    <div className='profile__container'>
      <form
        className='form'
        onSubmit={handleSubmit((data) => handleUpdateProfile({ userId, data }))}
      >
        <div className='profile__image-container mb-6'>
          <img src={defaultProfileImage} alt='WanderMap3d - user profile' />
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
        <div className='transition-all flex gap-6 flex-wrap mt-10'>
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
