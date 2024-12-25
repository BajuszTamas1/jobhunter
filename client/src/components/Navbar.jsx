import React from 'react';
import './Navbar.css';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLogoutState,
  selectLoggedIn,
  selectUser,
} from '../state/authSlice.js';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);

  const isAuthenticated = useSelector(selectLoggedIn);

  const handleClose = () => {
    setAnchorEl(null);
    navigate('/mainpage');
  };

  return (
    <>
      <AppBar position="sticky" className="navbar">
        <Toolbar sx={{ justifyContent: 'flex-start' }}>
          <Button
            sx={{ justifyContent: 'flex-start' }}
            variant="outline"
            component={NavLink}
            to="/"
          >
            <Typography variant="h6">Jobhunter</Typography>
          </Button>
          {!isAuthenticated && (
            <>
              <Button variant="outline" component={NavLink} to="/login">
                Bejelentkezés
              </Button>
              <Button variant="outline" component={NavLink} to="/register">
                Regisztráció
              </Button>
            </>
          )}
          {isAuthenticated && (
            <>
              <Button
                variant="outline"
                component={NavLink}
                to="/"
                style={{ marginLeft: 'auto' }}
              >
                Álláshirdetések
              </Button>
              {isAuthenticated && user.role == 'company' && (
                <>
                  <Button variant="outline" component={NavLink} to="/addjob">
                    Álláshirdetés hozzáadása
                  </Button>
                </>
              )}
              <Button variant="outline" component={NavLink} to="/profile">
                Profil
              </Button>
              <Button
                variant="outline"
                component={NavLink}
                onClick={() => {
                  dispatch(setLogoutState());
                  handleClose();
                }}
              >
                Kijelentkezés
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}
