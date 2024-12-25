import React, { useState, useEffect } from 'react';
import {
  Button,
  NativeSelect,
  Slider,
  Typography,
  TextField,
  TextareaAutosize,
  Box,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useCreateJobMutation } from '../state/api/jobApiSlice';
import { useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import './AddJob.css';

function valuetext(value) {
  return `${value}Ft`;
}

const AddJob = () => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    description: '',
    salaryFrom: 0,
    salaryTo: 0,
    type: 'full-time',
    city: '',
    homeOffice: false,
  });
  const [value, setValue] = React.useState([200000, 700000]);
  const [jobType, setType] = useState('full-time');
  const [createJob, { error, isError, isLoading }] = useCreateJobMutation();
  const state = useSelector((state) => state);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    if (isSuccessful) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccessful]);

  const [checked, setChecked] = useState(false);
  const handleCChange = (event) => {
    setChecked(event.target.checked);
    setFormData({ ...formData, homeOffice: event.target.checked });
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
    setFormData({ ...formData, type: event.target.value });
  };

  const handleInput = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const val = value;
      const updatedFormMod = {
        ...formData,
        salaryFrom: val[0],
        salaryTo: val[1],
      };
      if (!state.auth.token) {
        throw new Error('No authentication token provided');
      }
      if (
        !updatedFormMod.company ||
        !updatedFormMod.position ||
        !updatedFormMod.description ||
        !updatedFormMod.salaryFrom ||
        !updatedFormMod.salaryTo ||
        !updatedFormMod.type ||
        !updatedFormMod.city
      ) {
        throw new Error('Invalid data provided');
      }
      await createJob(updatedFormMod).unwrap();
      setIsSuccessful(true);
      setFormData({
        company: '',
        position: '',
        description: '',
        salaryFrom: 0,
        salaryTo: 0,
        type: 'full-time',
        city: '',
        homeOffice: false,
      });
      setValue([200000, 700000]);
    } catch (e) {
      console.error(e);
    }
  };

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
  };

  return (
    <div>
      <Typography variant="h3" className="hozzaadas">
        Hírdetés hozzáadása
      </Typography>
      <div id="main">
        {showAlert ? (
          <Alert
            sx={{ marginBottom: 5, width: 800, marginLeft: 2 }}
            severity="success"
            icon={<CheckIcon />}
          >
            Sikeres hozzáadás!
          </Alert>
        ) : null}
        <form method="dialog" onSubmit={handleSubmit}>
          <TextField
            label="Cég neve"
            type="text"
            id="company"
            name="company"
            className="text"
            onInput={handleInput}
          />
          <TextField
            label="Pozíció"
            type="text"
            id="position"
            className="text"
            onInput={handleInput}
          />
          <TextField
            label="Település"
            id="city"
            className="text"
            onInput={handleInput}
          />
          <NativeSelect
            defaultValue="full-time"
            placeholder="Teljes állás"
            name="type"
            onChange={(e) => setType(e.target.value)}
            onInput={handleTypeChange}
            className="text"
            sx={{
              height: '55px',
              border: '1px solid #ced4da',
              borderRadius: '5px',
              padding: '10px',
              margin: '10px 20px 0px 20px',
            }}
          >
            <option value="full-time">Teljes állás</option>
            <option value="part-time">Részmunkaidős</option>
            <option value="contract">Kontrakt</option>
            <option value="internship">Gyakornoki</option>
          </NativeSelect>
          <TextareaAutosize
            label="Leírás"
            id="description"
            className="textarea"
            placeholder="Leírás"
            onInput={handleInput}
          />
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
          <FormControlLabel
            control={<Checkbox />}
            label="Home office lehetőség"
            className="hol"
            onChange={handleCChange}
          ></FormControlLabel>
          <br />
          <Button
            variant="contained"
            className="szbtn"
            type="submit"
            sx={{ margin: '20px 20px 0px 20px', width: 200, fontSize: 'large' }}
          >
            Hozzáadás
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddJob;
