import React from 'react'
import Aside from '../../components/Aside';
import ProfileForm from '../../components/Profile';

const Profile = ({ role }) => {

  return (
    <section className="page-section mt-[8rem]">
        <div className="page-section__container">
            <h1 className="text-center mb-[6rem]">My profile</h1>
            <div className="flex flex-col xl:flex-row">
              <Aside role={role} />
              <ProfileForm />
            </div>
        </div>
    </section>
  )
}

export default Profile