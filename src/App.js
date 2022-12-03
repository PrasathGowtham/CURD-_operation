
import './App.css';
import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from "axios";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
function App() {
  let formValues = { name: "", Department: "", city: "", country: "", gender: "", error: { name: "", Department: "", city: "", country: "", gender: "" } }
  const [formData, setFormData] = useState(formValues);
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    async function getData() {
      const result = await axios.get("https://6323fadebb2321cba921f793.mockapi.io/employee");
      console.log(result);
      setUserData(result.data);
    }
    getData();
  }, []);





  const handleChange = (e) => {
    let error = { ...formData.error };
    if (e.target.value === "") {
      error[e.target.name] = `${e.target.name} is Required`;
    } else {
      error[e.target.name] = "";
    }
    setFormData({ ...formData, [e.target.name]: e.target.value, error });
  };

  const onPopulateData = (id) => {
    const selectedData = userData.filter((row) => row.id === id)[0];
    setFormData({
      ...formData,
      ...selectedData,
    });
  };
  const handleDelete = async (id) => {
    const response = await axios.delete(
      `https://6323fadebb2321cba921f793.mockapi.io/employee/${id}`
    );
    console.log(response);
    const user = userData.filter((row) => row.id !== response.data.id);
    setUserData(user);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Delete
    const errKeys = Object.keys(formData).filter((key) => {
      if (formData[key] === "" && key != "error" && key != "id") {
        return key;
      }
    });
    if (errKeys.length >= 1) {
      alert("Please fill all values");
    } else {
      if (formData.id) {
        // Update
        const response = await axios.put(
          `https://6323fadebb2321cba921f793.mockapi.io/employee/${formData.id}`,
          {
            name: formData.name,
            Department: formData.Department,
            city: formData.city,
            country: formData.country,
            gender: formData.gender,
          }
        );
        let users = [...userData];
        let index = users.findIndex((row) => row.id === response.data.id);
        users[index] = response.data;
        setUserData(users);
      } else {
        // Create
        const response = await axios.post(
          "https://6323fadebb2321cba921f793.mockapi.io/employee",
          {
            name: formData.name,
            Department: formData.Department,
            city: formData.city,
            country: formData.country,
            gender: formData.gender,
          }
        );
        setUserData([...userData, response.data]);
      }
      setFormData(formValues);
    }
  };





  return (

    <div>
      <div>

        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
          onSubmit={(e) => handleSubmit(e)}
        >
          <TextField id="filled-basic" label="Name" variant="filled" value={formData.name}
            name="name"
            onChange={(e) => handleChange(e)} /><br />
          <TextField id="filled-basic" label="Department" variant="filled" value={formData.Department}
            name="Department"
            onChange={(e) => handleChange(e)} /><br />
          <TextField id="filled-basic" label="City" variant="filled" value={formData.city}
            name="city"
            onChange={(e) => handleChange(e)} /><br />
          <TextField id="filled-basic" label="Country" variant="filled" value={formData.country}
            name="country"
            onChange={(e) => handleChange(e)} />


          <FormControl >
            <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="gender"

              value={formData.gender}
              onChange={(e) => handleChange(e)}
            >
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl><br />
          <Button variant="contained" type="submit">
            SUBMIT
          </Button>
        </Box>
      </div>
      <div className="App" style={{ padding: "100px" }}>
        <h1>Guest Wind Spares Employee Details</h1>
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>S.no</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell align="center">City</TableCell>
                  <TableCell align="center">Country</TableCell>
                  <TableCell align="center">Gender</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userData.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell component="th" scope="row" >
                      {row.name}
                    </TableCell>
                    <TableCell align="center">{row.Department}</TableCell>
                    <TableCell align="center">{row.city}</TableCell>
                    <TableCell align="center">{row.country}</TableCell>
                    <TableCell align="center">{row.gender}</TableCell>
                    <TableCell align="center"><Button style={{ margin: "10px" }} variant="contained" onClick={() => onPopulateData(row.id)}>
                      Edit
                    </Button>
                      <Button variant="contained" onClick={() => handleDelete(row.id)}>
                        Delete
                      </Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}




export default App;
