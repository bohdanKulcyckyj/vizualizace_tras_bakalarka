import { useState } from 'react';
import apiEndpoints from '../constants/apiEndpoints';
import axios from 'axios';
import { IForgottenPasswordForm } from '../interfaces/Form';
import { useForm } from 'react-hook-form';
import SubmitButton from '../components/dashboard/SubmitButton';

export default function ResetPassword() {
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(false);

  const { register, handleSubmit, formState: { errors } } = useForm<IForgottenPasswordForm>();

  const sendData = (data:IForgottenPasswordForm) => {
    setSuccessMsg('')
    setErrorMsg('')
    setDisable(true)
    setLoading(true)

    axios.post(apiEndpoints.resetPassword, data)
    .then(res => {
      console.log(res);
      setSuccessMsg("Successfully logged in");
    })
    .catch(err => {
      console.error(err);
      setErrorMsg("Logging in failed");
    })
    .finally(() => {
      setDisable(false)
      setLoading(false)
    })

    setTimeout(() => {
      setSuccessMsg('')
      setErrorMsg('')
    }, 5000)
  };

  return (
    <section className="page-section welcome-section">
      <div className="page-section__container flex justify-center items-center">
        <form className="relative z-10 p-6 sm:p-10 form form--standalone" onSubmit={handleSubmit(sendData)}>
          <div className="w-full mb-4 md:mb-8 text-center">
              <h1 className="mb-2 text-18px md:text-24px lg:text-30px uppercase tracking-widest font-bold">Forgotten password</h1>
              <p className="text-[15px]">Don't worry we will send you an e-mail with a reset password</p>
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

          <div className={`${successMsg || errorMsg ? "mb-4" : "mb-0"} transition-all flex justify-center mt-10`}>
            <SubmitButton
              label="reset password"
              buttonType="submit"
              isLoading={loading}
              isDisable={disable} />
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