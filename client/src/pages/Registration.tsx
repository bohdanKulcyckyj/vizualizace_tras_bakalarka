import React, { useState, useEffect } from 'react';
import { SIGN_UP} from '../api/endpoints';
import axios from 'axios';
import { IRegistrationForm } from '../interfaces/Forms';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export default function SignUp() {
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const { register, handleSubmit, watch, formState: { errors } } = useForm<IRegistrationForm>();
  const currentPassword = watch("password", "");

  const signUp = (data:IRegistrationForm) => {
    axios.post(SIGN_UP, data)
    .then(res => {
      console.log(res);
      setSuccessMsg("Registration was successful");
    })
    .catch(err => {
      console.error(err);
      setErrorMsg("Registration failed");
    })
  };

  return (
    <section className="page-section welcome-section">
      <div className="page-section__container flex justify-center items-center">
        <form className="relative z-10 p-6 sm:p-10 form" onSubmit={handleSubmit(signUp)}>
          <div className="w-full mb-4 md:mb-8 text-center">
              <h1 className="mb-2 text-18px md:text-24px lg:text-30px uppercase tracking-widest font-bold">Sign Up</h1>
              <p className="text-[15px]">Sign up and start your journey</p>
          </div>
          <div className='mb-4 form__input'>
            <input className={`${errors.name ? "mb-1" : "mb-0"}`}
              placeholder="Name" type="text" 
              {...register("email", {
                required: "Name is required",
                })} />
            {errors.name && (
                <p className='h-5 text-left mt-1 err'>
                    {errors.name.message}
                </p>
            )}
          </div>
          <div className='mb-4 form__input'>
            <input className={`${errors.email ? "mb-1" : "mb-0"}`}
              placeholder="Email" type="text" 
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email format"
                }
                })} />
            {errors.email && (
                <p className='h-5 text-left mt-1 err'>
                    {errors.email.message}
                </p>
            )}
          </div>
          <div className='mb-4 form__input'>
            <input 
            className={`${errors.password ? "mb-1" : "mb-0"}`} 
            placeholder="Password" type="password" 
            {...register("password", {
              required: "Password is required",
              minLength : {
                value: 8,
                message: "Your password is too short"
              }
            })} />
            {errors.password && (
                <p className='h-5 text-left mt-1 err'>
                    {errors.password.message}
                </p>
            )}
          </div>
          <div className='mb-4 form__input'>
            <input 
            className={`${errors.confirmPassword ? "mb-1" : "mb-0"}`} 
            placeholder="Confirm password" type="password" 
            {...register("confirmPassword", {
              required: "Password is required",
              validate: (value) =>
                value === currentPassword ||
                "Incorrect password",
              minLength : {
                value: 8,
                message: "Your password is too short"
              }
            })} />
            {errors.confirmPassword && (
                <p className='h-5 text-left mt-1 err'>
                    {errors.confirmPassword.message}
                </p>
            )}
          </div>
          <div className="w-full flex flex-wrap gap-2 justify-between mt-6">
            <p className="font-medium mr-6 whitespace-nowrap form-links">Already have an account? <Link to="/login" className="tracking-wider font-medium link--underlined" rel="noreferrer">Sign in</Link></p>
          </div>
          <div className={`${successMsg || errorMsg ? "mb-4" : "mb-0"} transition-all flex justify-center mt-10`}>
            <button className="primary-button">sign up</button>
          </div>

          {errorMsg ? (
              <div className={'w-full'}>
                  <p
                      className={'alert errorAlert text-center w-full'}
                  >
                      {errorMsg}
                  </p>
              </div>
          ) : null}

            {successMsg ? (
                <div className={"w-full"}>
                    <p className={"success text-center w-full"}>
                        {successMsg}
                    </p>
                </div>
            ) : null}
        </form>
      </div>
    </section>
  )
}