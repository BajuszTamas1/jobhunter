import { useEffect, useState } from 'react';
import { Typography, TextField, Button, Modal, Box, Select, MenuItem, Checkbox, FormControlLabel, Table, TableBody, TableHead, TableRow, TableCell, tableCellClasses } from '@mui/material';
import "./MainPage.css";
import { useGetJobsQuery } from './state/api/jobApiSlice';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useUserApplyMutation } from './state/api/userApiSlice';
import { useNavigate } from 'react-router-dom';
import { selectLoggedIn } from './state/authSlice';
import { useSelector } from 'react-redux';
export function MainPage() {

    const navigate = useNavigate();
    const handleRowClick = (id) => {
        navigate(`/jobpage/${id}`);
    }


    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const [page, setPage] = useState(1);
    const jobs = useGetJobsQuery(page);
    const jobData = jobs.data ? jobs.data.data : null;

    const [Foglalkozás, setFoglalkozás] = useState('fejlesztő');
    const handleFoglalkozásChange = (event) => {
        setFoglalkozás(event.target.value);
    }

    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (jobData && jobData.length < page * 10) {
            setHasMore(false);
        }
    }, [jobData, page]);

    console.log(jobData)

    const fetchMoreData = () => {
        setPage(page + 1);
    }

    const jobTypeMapping = {
        'full-time': 'Teljes munkaidős',
        'part-time': 'Részmunkaidős',
        'contract': 'Kontrakt',
        'internship': 'Gyakornoki'
    }


    return (
        <div>
            <Typography component='h1' variant='h2' className='fooldal'>Főoldal</Typography>

            <div id='main'>
                <Typography component='h2' variant='h5' className='bongessz'>Böngéssz az állások között:</Typography>
                <TextField label='Keress' name='search' className='search'></TextField>
                <Button type='submit' variant='contained' className='searchbtn' sx={{ padding: '10px', margin: '0px 10px 0px 10px', fontSize: 'medium' }}> Keresés </Button>
                <Button onClick={handleOpen} className='szures' sx={{ padding: '10px', fontSize: 'medium', border: ' 1px solid #ccc' }}>Szűrés</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 700, bgcolor: 'background.paper', boxShadow: 24, p: 4, }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Szűrők
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <form method="dialog">
                                <TextField label='Fizetési sáv alja' type='number' id='salMin' sx={{ margin: '0px 20px 20px 20px' }} />
                                <TextField label='Fizetési sáv teteje' type='number' id='salMax' /><br />
                                <Select labelId='foglalkozasIdLabel' id='foglalkozasId' value={Foglalkozás} label="Foglalkozás" onChange={handleFoglalkozásChange} sx={{ margin: '0px 20px 0px 20px' }}>
                                    <MenuItem value='fejlesztő'>Fejlesztő</MenuItem>
                                    <MenuItem value='projektvezető'>Projektvezető</MenuItem>
                                </Select>
                                <TextField label='Település' id='telepules' className='telepules' /><br />
                                <FormControlLabel control={<Checkbox />} label="Home office lehetőség" className='hol'></FormControlLabel><br />
                                <Button variant='contained' className='szbtn'>Szűrés</Button>
                            </form>
                        </Typography>
                    </Box>
                </Modal>
                <InfiniteScroll

                    dataLength={jobData ? jobData.length : 0}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                >
                    <Table className='table' sx={{
                        width:'65%', [`& .${tableCellClasses.root}`]: {
                            borderBottom: "none"
                        }
                    }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ borderBottom: 'none', fontWeight: 'bold', fontSize: 'medium' }}>Állás neve</TableCell>
                                <TableCell sx={{ borderBottom: 'none', fontWeight: 'bold', fontSize: 'medium', float: 'right' }}>Fizetés</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jobData && jobData.map((job) => (
                                <TableRow key={job.id} className='job' sx={{ border: '1px solid #ccc', cursor: 'pointer' }} onClick={() => handleRowClick(job.id)}>
                                    <TableCell>{job.position} <br /> {job.city}</TableCell>
                                    <TableCell sx={{ float: 'right' }}>{job.salaryFrom}Ft - {job.salaryTo}Ft <br /> {jobTypeMapping[job.type]}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </InfiniteScroll>
            </div>
        </div>
    );
}

