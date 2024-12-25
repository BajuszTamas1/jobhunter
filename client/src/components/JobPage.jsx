import { useEffect, useState } from 'react';
import { Typography, Button, Table, TableRow, TableCell } from '@mui/material';
import './JobPage.css';
import { useGetOneJobQuery } from '../state/api/jobApiSlice';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectLoggedIn } from '../state/authSlice';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import {
  useGetJobsForApplicantQuery,
  useDeleteApplyMutation,
  useUserApplyMutation,
} from '../state/api/userApiSlice';
import { selectUser } from '../state/authSlice';
export function JobPage() {
  const { id } = useParams();
  const jobId = Number(id);
  const job = useGetOneJobQuery(id);
  const selected = job.data;
  const [applied, setApplied] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [compSuccess, setCompSuccess] = useState(false);
  const [compAlert, setCompAlert] = useState(false);
  let user = null;

  const loggedin = useSelector(selectLoggedIn);
  if (loggedin) {
    user = useSelector(selectUser);
    const jobsForUser = useGetJobsForApplicantQuery(user.id);
    const jobsForUserData = jobsForUser.data ? jobsForUser.data : null;

    useEffect(() => {
      if (jobsForUserData) {
        for (let i = 0; i < jobsForUserData.length; i++) {
          if (jobsForUserData[i].jobId == jobId) {
            setApplied(true);
          }
        }
      }
      if (isSuccessful) {
        setShowAlert(true);
        const timer = setTimeout(() => {
          setShowAlert(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
      if (!compSuccess) {
        setCompAlert(true);
        const timer = setTimeout(() => {
          setCompAlert(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }, [jobsForUserData, jobId, isSuccessful, compSuccess]);
  }
  const [apiApply, { error, isLoading, isError }] = useUserApplyMutation();

  const [apiDeleteApply, { errorDelete, isLoadingDelete, isErrorDelete }] =
    useDeleteApplyMutation();

  const handleApply = async (e) => {
    e.preventDefault();
    if (user.role == 'company') {
      setCompSuccess(false);
      setCompAlert(true);
      return;
    }
    try {
      const response = await apiApply({
        jobId: jobId,
      }).unwrap();
      console.log(response);
      setIsSuccessful(true);
    } catch (error) {
      console.error(error.status);
    }
  };

  const handleDeleteApply = async (id) => {
    try {
      const response = await apiDeleteApply(id).unwrap();
      console.log(response);
      setApplied(false);
    } catch (error) {
      console.error(error.status);
    }
  };

  if (job.isLoading) {
    return <div>Loading...</div>;
  }

  if (job.isError) {
    return <div>Error</div>;
  }

  const jobTypeMapping = {
    'full-time': 'Teljes munkaidős',
    'part-time': 'Részmunkaidős',
    contract: 'Kontrakt',
    internship: 'Gyakornoki',
  };

  return (
    <div>
      <Typography
        component="h2"
        sx={{ fontSize: 28, fontWeight: 'bold' }}
        className="ceg"
      >
        {selected.company} Kft.{' '}
        {selected.homeOffice ? (
          <Button
            className="ho"
            variant="contained"
            color="success"
            sx={{ borderRadius: 10, fontSize: 11 }}
          >
            Homeoffice
          </Button>
        ) : null}{' '}
        <Typography sx={{ float: 'right' }}>
          {selected.salaryFrom}Ft - {selected.salaryTo}Ft <br />{' '}
          {jobTypeMapping[selected.type]}
        </Typography>
      </Typography>
      <div id="jobmain">
        {loggedin && showAlert ? (
          <Alert severity="success" icon={<CheckIcon />}>
            Sikeres jelentkezés!
          </Alert>
        ) : null}
        <Typography className="reszletek">Cég részletei</Typography>
        <Typography className="grey">
          Megtetszett a lehetőség? Jelentkezz!
        </Typography>
        {loggedin == true && applied == false ? (
          <Button
            sx={{ float: 'right', marginTop: '-45px', width: 135 }}
            variant="contained"
            onClick={handleApply}
          >
            Jelentkezz
          </Button>
        ) : null}
        {user !== null &&
        user.role === 'company' &&
        loggedin == true &&
        compAlert == true ? (
          <Alert severity="error">A cégek nem jelentkezhetnek állásokra!</Alert>
        ) : null}
        {loggedin == false ? (
          <Alert severity="error">A jelentkezéshez be kell jelentkezned!</Alert>
        ) : null}
        {loggedin && applied == true ? (
          <Button
            sx={{ float: 'right', marginTop: -5, width: 225 }}
            variant="contained"
            color="error"
            onClick={() => handleDeleteApply(jobId)}
          >
            Jelentkezés törlése
          </Button>
        ) : null}
        <Table>
          <TableRow>
            <TableCell className="grey">Név</TableCell>
            <TableCell className="cegreszletek">{selected.company}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="grey">Pozíció</TableCell>
            <TableCell className="cegreszletek">{selected.position}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="grey">Leírás</TableCell>
            <TableCell className="cegreszletek">
              {selected.description}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="grey">Fizetési sáv</TableCell>
            <TableCell className="cegreszletek">
              Bruttó: {selected.salaryFrom}Ft - {selected.salaryTo}Ft
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="grey">Foglalkozás típusa</TableCell>
            <TableCell className="cegreszletek">
              {jobTypeMapping[selected.type]}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="grey">Település</TableCell>
            <TableCell className="cegreszletek">{selected.city}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="grey">Home Office</TableCell>
            <TableCell className="cegreszletek">
              {selected.homeOffice ? 'Van' : 'Nincs'}
            </TableCell>
          </TableRow>
        </Table>
      </div>
    </div>
  );
}
