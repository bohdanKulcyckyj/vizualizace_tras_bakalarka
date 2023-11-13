import React from 'react'
import { ButtonType } from '../../interfaces/IButton';
import Table from '../../components/Table';
import Aside from '../../components/Aside';
import ProfileForm from '../../components/Profile';

const dummyData = {
    id: 1,
    name: "Petr Klíč",
    email: "petr.klic@seznam.cz",
    createdAt: new Date().toLocaleDateString(),
};

const Profile = () => {
  return (
    <section className="page-section mt-[8rem]">
        <div className="page-section__container">
            <h1 className="text-center mb-[6rem]">My profile</h1>
            <div className="flex flex-col xl:flex-row">
              <Aside role="admin" />
              <ProfileForm data={dummyData} />
            </div>
        </div>
    </section>
  )
}

export default Profile