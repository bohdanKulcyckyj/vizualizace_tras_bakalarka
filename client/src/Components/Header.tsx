import React, { useState} from 'react';
import { AppBar, Toolbar, IconButton } from '@mui/material';

import Logo from '../assets/logo-short.svg' 

const Header: React.FC = (props: any) => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  return (
    <>
        <AppBar position="fixed">
            <Toolbar>
              <img style={{"height": "60px"}} src={Logo} alt="WM3D - logo" />
            </Toolbar>
        </AppBar>
        <Toolbar />
    </>
  );
}

export default Header;