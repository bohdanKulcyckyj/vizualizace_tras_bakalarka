import { Typography } from '@mui/material'
import Link from '@mui/material/Link';
import React from 'react'

const Home = () => {
  return (
    <main>
      <section className="welcome-section">
        <Typography variant="h1">Domovská stránka</Typography>
        <Link href="/prihlaseni" variant="body2">přihlášení</Link>
      </section>
    </main>
  )
}

export default Home