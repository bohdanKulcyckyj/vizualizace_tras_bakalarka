import { useState } from 'react'
import apiEndpoints from '../constants/apiEndpoints'
import routes from '../constants/routes'
import axios from 'axios'
import { IRegistrationForm } from '../interfaces/Form'
import { useForm } from 'react-hook-form'
import { Link} from 'react-router-dom'
import SubmitButton from '../components/dashboard/SubmitButton'
import { toast } from 'sonner'
import useSignIn from '../hooks/useSignIn'
import { UserRoleMapper } from '../interfaces/User'

export default function SignUp() {
  const [loading, setLoading] = useState<boolean>(false)
  const [disable, setDisable] = useState<boolean>(false)
  const { storeSignIn } = useSignIn()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IRegistrationForm>()
  const currentPassword = watch('password', '')

  const signUp = (data: IRegistrationForm) => {
    setDisable(true)
    setLoading(true)

    axios
      .post(apiEndpoints.registration, data)
      .then((res) => {
        const { token, user } = res.data
        user.role = UserRoleMapper[user.role]
        storeSignIn(token, user, true)
        toast.success('Registration was successful')
      })
      .catch((err) => {
        console.error(err)
        toast.error('Registration failed')
      })
      .finally(() => {
        setDisable(false)
        setLoading(false)
      })
  }

  return (
    <section className='page-section welcome-section'>
      <div className='page-section__container flex justify-center items-center'>
        <form
          className='relative z-10 p-6 sm:p-10 form form--standalone'
          onSubmit={handleSubmit(signUp)}
        >
          <div className='w-full mb-4 md:mb-8 text-center'>
            <h1 className='mb-2 text-18px md:text-24px lg:text-30px uppercase tracking-widest font-bold'>
              Sign Up
            </h1>
            <p className='text-[15px]'>Sign up and start your journey</p>
          </div>
          <div className='mb-4 form__input'>
            <input
              className={`${errors.name ? 'mb-1' : 'mb-0'}`}
              placeholder='Name'
              type='text'
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
          <div className='mb-4 form__input'>
            <input
              className={`${errors.password ? 'mb-1' : 'mb-0'}`}
              placeholder='Password'
              type='password'
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Your password is too short',
                },
              })}
            />
            {errors.password && (
              <p className='h-5 text-left mt-1 err'>
                {errors.password.message}
              </p>
            )}
          </div>
          <div className='mb-4 form__input'>
            <input
              className={`${errors.confirmPassword ? 'mb-1' : 'mb-0'}`}
              placeholder='Confirm password'
              type='password'
              {...register('confirmPassword', {
                required: 'Password is required',
                validate: (value) =>
                  value === currentPassword || 'Incorrect password',
                minLength: {
                  value: 8,
                  message: 'Your password is too short',
                },
              })}
            />
            {errors.confirmPassword && (
              <p className='h-5 text-left mt-1 err'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className='w-full flex flex-wrap gap-2 justify-between mt-6'>
            <p className='font-medium mr-6 whitespace-nowrap form-links'>
              Already have an account?{' '}
              <Link
                to={routes.login}
                className='tracking-wider font-medium link--underlined'
                rel='noreferrer'
              >
                Sign in
              </Link>
            </p>
          </div>
          <div className='flex justify-center mt-10'>
            <SubmitButton
              label='sign up'
              buttonType='submit'
              isLoading={loading}
              isDisable={disable}
            />
          </div>
        </form>
      </div>
    </section>
  )
}
