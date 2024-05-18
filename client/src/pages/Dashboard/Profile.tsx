import Aside from '../../components/Aside'
import ProfileForm from '../../components/dashboard/ProfileForm'

const Profile = () => {
  return (
    <section className='page-section mt-[8rem]'>
      <div className='page-section__container'>
        <h1 className='text-center mb-[6rem]'>My profile</h1>
        <div className='flex flex-col xl:flex-row'>
          <Aside />
          <ProfileForm />
        </div>
      </div>
    </section>
  )
}

export default Profile
