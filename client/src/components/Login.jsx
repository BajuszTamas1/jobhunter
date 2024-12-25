import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoadingButton } from '@mui/lab';
import { Alert, Stack, TextField, Typography } from '@mui/material';
import { useDispatch} from 'react-redux';
import { useLoginMutation } from "../state/api/authApiSlice";
import { setLoginState } from "../state/authSlice";

import './Login.css'

export function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [apiLogin, { error, isLoading, isError }] = useLoginMutation();

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await apiLogin({
                strategy: 'local',
                email: formData.email,
                password: formData.password
            }).unwrap();
            dispatch(
                setLoginState({
                    accessToken: response.accessToken,
                    user: response.user
                })
            );
            console.log(response);
            return navigate('/');
        } catch (error) {
            console.error(error.status);
        }
    };

    return (
        <>
            <Stack component='form' spacing={4} onSubmit={handleLogin} className="panel">
                <Typography variant="h2" component='h1' style={{ marginTop: '4rem', textAlign: 'center' }} className="title">
                    Bejelentkezés
                </Typography>
                {location?.state?.redirected && <Alert severity='error'>A funkció eléréséhez be kell jelentkezned!</Alert>}

                {isError && <Alert severity='error'>Sikertelen bejelentkezés! Hibakód: {error.status}.</Alert>}
                <TextField
                    label='Email-cím'
                    name="email"
                    type="email"
                    required
                    value={formData.email ?? ''}
                    onInput={handleInput}
                    className="input"
                />
                <TextField
                    label='Jelszó'
                    name="password"
                    type="password"
                    required
                    value={formData.password ?? ''}
                    onInput={handleInput}
                    className="input"
                />
                <div className="btndiv">
                <LoadingButton
                    type='submit'
                    variant='contained'
                    loading={isLoading}
                    className="button"
                >
                    Bejelentkezés
                </LoadingButton>
                </div>
            </Stack>
        </>
    )
}
