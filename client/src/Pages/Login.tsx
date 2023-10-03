import React, { useEffect } from 'react';
import { SIGN_IN } from '../api/endpoints';
import axios from 'axios';
import { ILoginForm } from '../interfaces/Forms';
import { useForm } from 'react-hook-form';

export default function SignIn() {

  const { register, handleSubmit } = useForm<ILoginForm>();

  const signIn = (data:ILoginForm) => {
    axios.post(SIGN_IN, data)
    .then(res => console.log(res))
    .catch(err => console.error(err))
  };

  return (
    <section className="page-section">
      <div className="page-section__container flex justify-center">
        <form className="p-6 sm:p-10 form" onSubmit={handleSubmit(signIn)}>
          <div className="w-full mb-4 md:mb-8 text-center">
              <h1 className="mb-2 text-18px md:text-24px uppercase tracking-widest">Přihlášení</h1>
              <p>Přihlaste se do svého účtu</p>
          </div>
          <div className='mb-4 form__input'>
            <input placeholder="Email" type="text" {...register("email", {required: "Email je povinný"})} />
          </div>
          <div className='mb-4 form__input'>
            <input placeholder="Heslo" type="text" {...register("password", {required: "Heslo je povinné"})} />
          </div>
          <div className="flex justify-center">
            <button className="uppercase">odeslat</button>
          </div>
        </form>
      </div>
    </section>
  )
}