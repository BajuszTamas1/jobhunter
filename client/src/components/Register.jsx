import { Alert, Stack, TextField, Typography, NativeSelect, InputLabel, TextareaAutosize } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../state/api/authApiSlice';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useAddExperienceMutation } from '../state/api/userApiSlice';
import { useLoginMutation } from '../state/api/authApiSlice';
import { useDispatch } from 'react-redux';
import { setLoginState, setLogoutState } from '../state/authSlice';

import './Login.css'
export function Register() {
    const [role, setRole] = useState('Válassz...');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [apiLogin, { loginerror, loginisLoading, loginisError }] = useLoginMutation();

    const [formData, setFormData] = useState({ fullname: '', email: '', password: '', role: 'company' });
    const [register, { error, isError, isLoading }] = useRegisterMutation();
    const [experience, setExperience] = useState('');
    const [addExperience, { errorAdd, isErrorAdd, isLoadingAdd }] = useAddExperienceMutation();
    console.log(experience)
    const handleInput = event => {
        const { name, value } = event.target;
        if (name === 'experience') {
            const experiences = value.split('\n').map(line => {
                const [company, title, interval] = line.split(';');
                return { company, title, interval };
            });
            setExperience(experiences);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await register({ ...formData }).unwrap();
            handleLogin(event);
        } catch (e) {
            if (e.status === 500) {
                console.error('Email already exists!');
            } else {
                console.error(e.status);
            }
        }
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
            handleAddExperience(e);
        } catch (error) {
            console.error(error.status);
        }
    };

    const handleAddExperience = async (e) => {
        e.preventDefault();
        try {
            const response = await addExperience(experience).unwrap();
            dispatch(
                setLogoutState()
            );
            navigate('/login');
            console.log(response);
        } catch (error) {
            console.error(error.status);
        }
    };
    return (
        <>
            <Stack component='form' spacing={4} onSubmit={handleSubmit} className='panel'>
                <Typography variant='h2' component='h1' style={{ marginTop: '4rem', textAlign: 'center' }} className='title'>
                    Fiók létrehozása
                </Typography>

                {isError && <Alert severity='error'>Sikertelen Regisztráció! Hibakód: {error.status}.</Alert>}

                <TextField label='Név' name='fullname' required onInput={handleInput} value={formData.fullname} className='input' />

                <TextField label='Email cím' name='email' type='email' required
                    onInput={handleInput} value={formData.email}
                    className='input'
                />

                <TextField label='Jelszó' name='password' type='password' required
                    onInput={handleInput} value={formData.password}
                    className='input'
                />

                <InputLabel variant="standard" htmlFor="uncontrolled-native" className='type'>
                    Típus:
                </InputLabel>
                <NativeSelect
                    defaultValue='company'
                    placeholder='Válassz...'
                    name='role'
                    onChange={(e) => setRole(e.target.value)}
                    onInput={handleInput}
                    className='input'
                >
                    <option value='company'>Munkáltató</option>
                    <option value='jobseeker'>Munkavállaló</option>
                </NativeSelect>

                {role === 'jobseeker' && (
                    <div className='textareadiv'>
                        <TextareaAutosize
                            minRows={3}
                            placeholder='Korábbi munkatapasztalatok...'
                            name='experience'
                            onInput={handleInput}
                            className='textarea'
                        />
                    </div>
                )}

                <div className='btndiv'>
                    <LoadingButton className='button' type='submit' variant='contained' loading={isLoading}
                    >
                        Regisztáció
                    </LoadingButton>
                </div>
            </Stack>
        </>
    )
}