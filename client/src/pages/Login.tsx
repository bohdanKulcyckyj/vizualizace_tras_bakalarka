import { useState } from 'react';
import apiEndpoints from '../constants/apiEndpoints';
import { saveTokenToCookie } from '../utils/jwt';
import axios from 'axios';
import { ILoginForm } from '../interfaces/Form';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import routes from '../constants/routes';
import { UserRoleMapper } from '../interfaces/User';
import { useMainContext } from '../context/MainContext';
import SubmitButton from '../components/dashboard/SubmitButton';
import { toast } from 'sonner';

export default function SignIn() {
  const [loading, setLoading] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);
  const { setLoggedUser } = useMainContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>();

  const signIn = (data: ILoginForm) => {
    setDisable(true);
    setLoading(true);

    axios
      .post(apiEndpoints.login, data)
      .then((res) => {
        const { token, role } = res.data;
        saveTokenToCookie(token);
        const userObj = {
          role: UserRoleMapper[role],
        }
        setLoggedUser(userObj);
        sessionStorage.setItem('loggedUser', JSON.stringify(userObj))
        navigate(routes.dashboard.profile(UserRoleMapper[role]));
      })
      .catch((err) => {
        toast.error('Logging in failed');
      })
      .finally(() => {
        setDisable(false);
        setLoading(false);
      });
  };

  return (
    <section className='page-section welcome-section'>
      <div className='page-section__container flex justify-center items-center'>
        <form
          className='relative z-10 p-6 sm:p-10 form form--standalone'
          onSubmit={handleSubmit(signIn)}
        >
          <div className='w-full mb-4 md:mb-8 text-center'>
            <h1 className='mb-2 text-18px md:text-24px lg:text-30px uppercase tracking-widest font-bold'>
              Sign In
            </h1>
            <p className='text-[15px]'>Sign in and start your journey</p>
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
          <div className='w-full flex flex-wrap gap-2 justify-between mt-6'>
            <p className='font-medium mr-6 whitespace-nowrap form-links'>
              Don't have an account yet?{' '}
              <Link
                to={routes.register}
                className='tracking-wider font-medium link--underlined'
                rel='noreferrer'
              >
                Sign up
              </Link>
            </p>
            <Link
              className='tracking-wider form-links link--underlined'
              to={routes.forgottenPasword}
              rel='noreferrer'
            >
              Forgot your password?
            </Link>
          </div>
          <div className='flex justify-center mt-10'>
            <SubmitButton
              label='sign in'
              buttonType='submit'
              isLoading={loading}
              isDisable={disable}
            />
          </div>
        </form>
      </div>
    </section>
  );
}
