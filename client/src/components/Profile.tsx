import React, { useEffect, useState } from "react";
import defaultProfileImage from "../assets/images/profile.png";
import { useForm } from "react-hook-form";
import { IProfileForm } from "../interfaces/Forms";
import { Link } from 'react-router-dom';

const Profile = ({ data }) => {
  const [isFieldsDisabled, setIsFieldsDisabled] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IProfileForm>();

  const sendData = (data) => {
    console.log("sending data...");
    setErrorMsg("Something went wrong. Try again please.");
  }

  useEffect(() => {
    setValue("email", "bohdan.kulchytskyy@seznam.cz");
    setValue("name", "Bohdan");
  }, []);

  return (
    <div className="profile__container">
      <form className="form" onSubmit={handleSubmit(sendData)}>
        <div className="profile__image-container mb-6">
          <img src={defaultProfileImage} alt="WanderMap3d - profile image" />
        </div>
        <div className="mb-4 form__input">
          <input
            className={`${errors.name ? "mb-1" : "mb-0"}`}
            placeholder="Name"
            type="text"
            disabled={isFieldsDisabled}
            {...register("name", {
              required: "Name is required",
            })}
          />
          {errors.name && (
            <p className="h-5 text-left mt-1 err">{errors.name.message}</p>
          )}
        </div>
        <div className="mb-4 form__input">
          <input
            className={`${errors.email ? "mb-1" : "mb-0"}`}
            placeholder="Email"
            type="text"
            disabled={isFieldsDisabled}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && (
            <p className="h-5 text-left mt-1 err">{errors.email.message}</p>
          )}
        </div>
        <div className={`${successMsg || errorMsg ? "mb-4" : "mb-0"} transition-all flex gap-6 flex-wrap mt-10`}>
            {isFieldsDisabled 
            ? (<button onClick={(e) => {e.preventDefault();setIsFieldsDisabled(false)}} className="primary-button">Change</button>)
            : (
              <>
                <button type="submit" className="primary-button">Save</button>
                <Link to="/forgotten-password" className="secondary-button">Change password</Link>
              </>
            )}
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
  );
};

export default Profile;
