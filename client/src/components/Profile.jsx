import { Button, Stack, Slider, Typography, Modal, Box, TextField, Grid, Tooltip, IconButton, TextareaAutosize, Table, TableBody, TableCell, TableRow, NativeSelect, FormControlLabel, Checkbox } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/HelpOutline';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setLogoutState } from '../state/authSlice.js';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useCreateJobMutation, useDeleteJobMutation, useUpdateJobMutation } from '../state/api/jobApiSlice.js';
import { useGetJobsForCompanyQuery } from '../state/api/jobApiSlice.js';
import { useAddExperienceMutation, useDeleteExperienceMutation, useUpdateExperienceMutation, useUserExperiencesQuery, useGetApplicantsForAJobQuery } from '../state/api/userApiSlice.js';
import { tableCellClasses } from '@mui/material/TableCell';
import PlaceIcon from '@mui/icons-material/Place';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import './Profile.css';

function valuetext(value) {
    return `${value}Ft`;
}

export function Profile() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const jobs = useGetJobsForCompanyQuery(user.id);
    const jobData = jobs.data ? jobs.data.data : null;
    const [jobId, setJobId] = useState('');
    const jobApplicants = useGetApplicantsForAJobQuery(jobId);
    const jobApplicantsData = jobApplicants.data ? jobApplicants.data : null;
    const jobUsers = jobApplicantsData ? jobApplicantsData.map(item => item.user) : null;

    const experiences = useUserExperiencesQuery();
    const experienceData = experiences.data ? experiences.data.data : null;
    const [value, setValue] = React.useState([200000, 700000]);
    const [formData, setFormData] = useState({ company: '', position: '', description: '', salaryFrom: 0, salaryTo: 0, type: 'full-time', city: '', homeOffice: false });
    const [experienceFormData, setExperienceFormData] = useState({ company: '', title: '', interval: '' });
    const [createJob, { error, isError, isLoading }] = useCreateJobMutation();
    const [deleteJob, { error: deleteError, deleteIsError, deleteIsLoading }] = useDeleteJobMutation();
    const [updateJob, { error: updateError, updateIsError, updateIsLoading }] = useUpdateJobMutation();
    const [addExperience, { error: addError, addIsError, addIsLoading }] = useAddExperienceMutation();
    const [deleteExperience, { error: deleteExpError, deleteExpIsError, deleteExpIsLoading }] = useDeleteExperienceMutation();
    const [updateExperience, { error: updateExpError, updateExpIsError, updateExpIsLoading }] = useUpdateExperienceMutation();

    const handleLogout = () => {
        dispatch(setLogoutState());
        navigate('/');
    };
    const state = useSelector(state => state);

    const handleDelete = async (id) => {
        try {
            await deleteJob(id).unwrap();
        } catch (e) {
            console.error(e);
        }
    }

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [modifyOpen, setModifyOpen] = useState(false);
    const handleModifyOpen = () => setModifyOpen(true);
    const handleModifyClose = () => setModifyOpen(false);

    const [experienceOpen, setExperienceOpen] = useState(false);
    const handleExperienceOpen = () => setExperienceOpen(true);
    const handleExperienceClose = () => setExperienceOpen(false);

    const [modifyExpOpen, setModifyExpOpen] = useState(false);
    const handleModifyExpOpen = () => setModifyExpOpen(true);
    const handleModifyExpClose = () => setModifyExpOpen(false);

    const [viewOpen, setViewOpen] = useState(false);
    const handleViewOpen = () => setViewOpen(true);
    const handleViewClose = () => setViewOpen(false);

    const [jobType, setType] = useState('full-time');

    const [checked, setChecked] = useState(false);
    const handleCChange = (event) => {
        setChecked(event.target.checked);
        setFormData({ ...formData, homeOffice: event.target.checked });
    }

    const handleTypeChange = (event) => {
        setType(event.target.value);
        setFormData({ ...formData, type: event.target.value });
    }
    const handleInput = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    }
    const handleExperienceInput = (e) => {
        const { id, value } = e.target;
        setExperienceFormData({ ...experienceFormData, [id]: value });
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const val = value;
            const updatedFormMod = { ...formData, salaryFrom: val[0], salaryTo: val[1] };
            if (!state.auth.token) {
                throw new Error('No authentication token provided');
            }
            if (!updatedFormMod.company || !updatedFormMod.position || !updatedFormMod.description || !updatedFormMod.salaryFrom || !updatedFormMod.salaryTo || !updatedFormMod.type || !updatedFormMod.city) {
                throw new Error('Invalid data provided');
            }
            await createJob(updatedFormMod).unwrap();
            handleClose();
        } catch (e) {
            console.error(e);
        }
    }

    const handleModify = async (e) => {
        e.preventDefault();
        try {
            const val = value;
            const updatedFormMod = { ...formData, salaryFrom: val[0], salaryTo: val[1] };
            if (!state.auth.token) {
                throw new Error('No authentication token provided');
            }
            if (!updatedFormMod.company || !updatedFormMod.position || !updatedFormMod.description || !updatedFormMod.salaryFrom || !updatedFormMod.salaryTo || !updatedFormMod.type || !updatedFormMod.city) {
                throw new Error('Invalid data provided');
            }
            await updateJob({ id: jobId, ...updatedFormMod }).unwrap();
            handleModifyClose();
        } catch (e) {
            console.error(e);
        }
    }

    const handleAddExperience = async (e) => {
        e.preventDefault();
        try {
            if (!state.auth.token) {
                throw new Error('No authentication token provided');
            }
            if (!experienceFormData.company || !experienceFormData.title || !experienceFormData.interval) {
                throw new Error('Invalid data provided');
            }
            await addExperience(experienceFormData).unwrap();
            handleExperienceClose();
            experiences.refetch();
        } catch (e) {
            console.error(e);
        }
    }

    const handleExperienceDel = async (id) => {
        try {
            await deleteExperience(id).unwrap();
            experiences.refetch();
        } catch (e) {
            console.error(e);
        }
    }
    const [experienceId, setExperienceId] = useState('');
    const handleExperienceModify = async (e) => {
        e.preventDefault();
        try {
            const updatedExpFormMod = { ...experienceFormData };
            if (!state.auth.token) {
                throw new Error('No authentication token provided');
            }
            if (!experienceFormData.company || !experienceFormData.title || !experienceFormData.interval) {
                throw new Error('Invalid data provided');
            }
            await updateExperience({ id: experienceId, ...updatedExpFormMod }).unwrap();
            handleModifyExpClose();
            experiences.refetch();
        } catch (e) {
            console.error(e);
        }
    }

    const marks = [
        {
            value: 0,
            label: '0 Ft',
        },
        {
            value: 1000000,
            label: '1000000 Ft',
        },
    ];



    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const jobTypeMapping = {
        'full-time': 'Teljes munkaidős',
        'part-time': 'Részmunkaidős',
        'contract': 'Kontrakt',
        'internship': 'Gyakornoki'
    }

    return (
        <>
            <Typography variant='h3' className='profilom'>Profilom</Typography>
            {user.role != 'company' &&
                <Stack spacing={2} className='main'>
                    <Stack>
                        <Grid justify="space-between" container columnSpacing={24}>
                            <Grid item >
                                <Typography>Személyes adatok</Typography>
                                <Typography>Adataid és tapasztalataid egy helyen</Typography>
                            </Grid>
                        </Grid>
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <Typography variant='body1'>Név:</Typography>
                        <Typography variant='body1'>{user.fullname}</Typography>
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <Typography variant='body1'>E-mail:</Typography>
                        <Typography variant='body1'>{user.email}</Typography>
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={2}>
                        <Typography variant='body1'>Státusz:</Typography>
                        <Typography variant='body1'>{user.role === 'jobseeker' ? 'Munkavállaló' : 'Munkáltató'}</Typography>
                    </Stack>
                    <Stack>
                        <Typography variant='h4'>Previous experiences</Typography>
                        {experienceData && experienceData.map((exp, index) => (
                            <Table sx={{ border: '1px solid black' }} key={index}>
                                <TableBody sx={{ height: 50 }}>
                                    <TableRow sx={{ height: '50px', border: '1px solid black' }}>
                                        <TableCell sx={{ width: 250 }}>
                                            <Typography variant='h6'>{exp.company}</Typography>
                                        </TableCell>
                                        <TableCell>{exp.title} {exp.interval}</TableCell>
                                        <TableCell>
                                            <Button sx={{ float: 'right', width: 250, fontSize: '14px' }} variant='outlined' onClick={() => { handleModifyExpOpen(), setExperienceId(exp.id) }} >Tapasztalat szerkesztése</Button>
                                            <Button sx={{ float: 'right', marginRight: 1 }} variant='contained' color='error' onClick={() => handleExperienceDel(exp.id)} >Tapasztalat törlése</Button>
                                            <Modal
                                                open={modifyExpOpen}
                                                onClose={handleModifyExpClose}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 900, bgcolor: 'background.paper', boxShadow: 24, p: 4, }}>
                                                    <Typography variant="h6" component="h6">
                                                        Tapasztalat szerkesztése
                                                    </Typography>
                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                                        <form method="dialog" onSubmit={handleExperienceModify}>
                                                            <TextField label='Munkáltató' type='text' id='company' sx={{ margin: '0px 20px 20px 20px' }} onInput={handleExperienceInput} />
                                                            <TextField label='Pozíció' type='text' id='title' sx={{ margin: '0px 20px 20px 20px' }} onInput={handleExperienceInput} />
                                                            <TextField label="Intervallum" type='text' id="interval" sx={{ margin: '0px 20px 20px 20px' }} onInput={handleExperienceInput}></TextField>
                                                            <Tooltip title="Intervallum formátuma: YYYY-YYYY">
                                                                <IconButton>
                                                                    <QuestionMarkIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Button variant='contained' className='szbtn' type='submit' sx={{ margin: '0px 20px 20px 20px' }}>Módosítás</Button>
                                                        </form>
                                                    </Typography>
                                                </Box>
                                            </Modal>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        ))}
                    </Stack>
                    <Stack>
                        <div className='experienceadd'>
                            <Button className='addexprbtn' variant='contained' onClick={handleExperienceOpen}>Tapasztalat hozzáadása</Button>
                        </div>
                        <Modal
                            open={experienceOpen}
                            onClose={handleExperienceClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 900, bgcolor: 'background.paper', boxShadow: 24, p: 4, }}>
                                <Typography variant="h6" component="h6">
                                    Tapasztalat hozzáadása
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    <form method="dialog" onSubmit={handleAddExperience}>
                                        <TextField label='Munkáltató' type='text' id='company' sx={{ margin: '0px 20px 20px 20px' }} onInput={handleExperienceInput} />
                                        <TextField label='Pozíció' type='text' id='title' sx={{ margin: '0px 20px 20px 20px' }} onInput={handleExperienceInput} />
                                        <TextField label="Intervallum" type='text' id="interval" sx={{ margin: '0px 20px 20px 20px' }} onInput={handleExperienceInput}></TextField>
                                        <Tooltip title="Intervallum formátuma: YYYY-YYYY">
                                            <IconButton>
                                                <QuestionMarkIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Button variant='contained' className='szbtn' type='submit' sx={{ margin: '0px 20px 20px 20px' }}>Hozzáadás</Button>
                                    </form>
                                </Typography>
                            </Box>
                        </Modal>
                        <div className='btndiv'>
                            <Button sx={{ marginTop: '10px' }} className='logoutbtn' variant='contained' onClick={handleLogout}>Kijelentkezés</Button>
                        </div>
                    </Stack>
                </Stack>
            }
            {user.role == 'company' &&
                <div className='main'>
                    <Stack spacing={2} sx={{ width: '100%' }}>
                        <Stack>
                            <Typography variant='h4'>Személyes adatok:</Typography>
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2}>
                            <Typography variant='body1'>Név:</Typography>
                            <Typography variant='body1'>{user.fullname}</Typography>
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2}>
                            <Typography variant='body1'>E-mail:</Typography>
                            <Typography variant='body1'>{user.email}</Typography>
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={2}>
                            <Typography variant='body1'>Státusz:</Typography>
                            <Typography variant='body1'>{user.role === 'company' ? 'Munkáltató' : 'Munkavállaló'}</Typography>
                        </Stack>
                        <Typography variant='h4'>A te hirdetéseid: </Typography>
                        <Stack sx={{ width: '90%' }}>

                            {jobData && jobData.map((job, index) => (
                                <Table sx={{
                                    width: 'auto', [`& .${tableCellClasses.root}`]: {
                                        borderBottom: "none"
                                    }
                                }} key={index}>
                                    <TableBody sx={{ height: 50 }}>
                                        <TableRow sx={{ border: '1px solid #ccc' }}>
                                            <TableCell sx={{ width: '50%' }}>
                                                <Typography variant='h6' sx={{marginTop:2, fontWeight:'bold'}}>{job.position}</Typography>
                                                <Typography variant='h6'sx={{marginTop:4, color:'#aaa'}}> <BusinessCenterIcon sx={{marginTop:-1}}/>{jobTypeMapping[job.type]} {'\u00A0'} <PlaceIcon sx={{marginTop:-1}}/>{job.city} {'\u00A0'} <MonetizationOnIcon sx={{marginTop:-1}}/>{job.salaryFrom} Ft - {job.salaryTo} Ft</Typography>
                                                <Stack sx={{float:'right', marginTop:-14}}>
                                                    <Button variant='outlined' className='jobBtn' onClick={() => { handleModifyOpen(), setJobId(job.id) }}>Szerkesztés</Button>
                                                    <Button variant='outlined' className='jobBtn' onClick={() => { handleViewOpen(), setJobId(job.id) }}>Megtekintés</Button>
                                                    <Button variant='contained' color='error' className='jobBtn' onClick={() => handleDelete(job.id)}>Törlés</Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>
                            ))}
                        </Stack>
                        <Stack>
                            <div className='btndiv'>
                                <Button variant='contained' sx={{ width: "225px" }} onClick={handleOpen}>Hirdetés hozzáadása</Button>
                            </div>
                            <div className='logoutbtndiv'>
                                <Button sx={{ marginTop: '10px' }} className='logoutbtn' variant='contained' onClick={handleLogout}>Kijelentkezés</Button>
                            </div>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 900, bgcolor: 'background.paper', boxShadow: 24, p: 4, }}>
                                    <Typography variant="h6" component="h6">
                                        Hírdetés hozzáadása
                                    </Typography>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }} />
                                    <form method="dialog" onSubmit={handleSubmit}>
                                        <TextField label='Cég neve' type='text' id='company' name='company' className='text' onInput={handleInput} />
                                        <TextField label='Pozíció' type='text' id='position' className='text' onInput={handleInput} />
                                        <TextField label='Település' id='city' className='text' onInput={handleInput} />
                                        <NativeSelect
                                            defaultValue='full-time'
                                            placeholder='Teljes állás'
                                            name='type'
                                            onChange={(e) => setType(e.target.value)}
                                            onInput={handleTypeChange}
                                            className='text'
                                            sx={{ height: '55px', border: '1px solid #ced4da', borderRadius: '5px', padding: '10px', margin: '10px 20px 0px 20px' }}
                                        >
                                            <option value='full-time'>Teljes állás</option>
                                            <option value='part-time'>Részmunkaidős</option>
                                            <option value="contract">Kontrakt</option>
                                            <option value="internship">Gyakornoki</option>
                                        </NativeSelect>
                                        <TextareaAutosize label="Leírás" id="description" className='textarea' placeholder='Leírás' onInput={handleInput} />
                                        <Box sx={{ width: 790, marginLeft: '20px' }}>
                                            <Slider
                                                getAriaLabel={() => 'Fizetési sáv'}
                                                value={value}
                                                min={0}
                                                max={1000000}
                                                onChange={handleChange}
                                                valueLabelDisplay="auto"
                                                getAriaValueText={valuetext}
                                                marks={marks}
                                            />
                                        </Box>
                                        <FormControlLabel control={<Checkbox />} label="Home office lehetőség" className='hol' onChange={handleCChange}></FormControlLabel><br />
                                        <Button variant='contained' className='szbtn' type='submit' sx={{ margin: '20px 20px 0px 20px', width: 200, fontSize: 'large' }}>Hozzáadás</Button>
                                    </form>

                                </Box>
                            </Modal>
                            <Modal
                                open={modifyOpen}
                                onClose={handleModifyClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 900, bgcolor: 'background.paper', boxShadow: 24, p: 4, }}>
                                    <Typography variant="h6" component="h6">
                                        Munka módosítása
                                    </Typography>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        <form method="dialog" onSubmit={handleModify}>
                                            <TextField label='Cég neve' type='text' id='company' name='company' className='text' onInput={handleInput} />
                                            <TextField label='Pozíció' type='text' id='position' className='text' onInput={handleInput} />
                                            <TextField label='Település' id='city' className='text' onInput={handleInput} />
                                            <NativeSelect
                                                defaultValue='full-time'
                                                placeholder='Teljes állás'
                                                name='type'
                                                onChange={(e) => setType(e.target.value)}
                                                onInput={handleTypeChange}
                                                className='text'
                                                sx={{ height: '55px', border: '1px solid #ced4da', borderRadius: '5px', padding: '10px', margin: '10px 20px 0px 20px' }}
                                            >
                                                <option value='full-time'>Teljes munkaidő</option>
                                                <option value='part-time'>Részmunkaidős</option>
                                                <option value="contract">Kontrakt</option>
                                                <option value="internship">Gyakornoki</option>
                                            </NativeSelect>
                                            <TextareaAutosize label="Leírás" id="description" className='textarea' placeholder='Leírás' onInput={handleInput} />
                                            <Box sx={{ width: 790, marginLeft: '20px' }}>
                                                <Slider
                                                    getAriaLabel={() => 'Fizetési sáv'}
                                                    value={value}
                                                    min={0}
                                                    max={1000000}
                                                    onChange={handleChange}
                                                    valueLabelDisplay="auto"
                                                    getAriaValueText={valuetext}
                                                    marks={marks}
                                                />
                                            </Box>
                                            <FormControlLabel control={<Checkbox />} label="Home office lehetőség" className='hol' onChange={handleCChange}></FormControlLabel><br />
                                            <Button variant='contained' className='szbtn' type='submit' sx={{ margin: '0px 20px 20px 20px' }}>Módosítás</Button>
                                        </form>
                                    </Typography>
                                </Box>
                            </Modal>
                            <Modal
                                open={viewOpen}
                                onClose={handleViewClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 900, bgcolor: 'background.paper', boxShadow: 24, p: 4, }}>
                                    <Typography variant="h6" component="h6">
                                        Munkára jelentkezők
                                        <Table>
                                            <TableBody>
                                                {jobUsers !== null && jobUsers !== undefined && jobUsers.length > 0 ? (
                                                    jobUsers.map((user, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{user.fullname}</TableCell>
                                                            <TableCell>{user.email}</TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell>Nincsenek a munkára jelentkezők</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </Typography>

                                </Box>
                            </Modal>
                        </Stack>
                    </Stack>
                </div>
            }
        </>
    );
}