import React, { useState } from 'react';
import Head from 'next/head';
import Container from "@mui/material/Container";
import { TextField }  from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import { getCookies, removeCookies } from 'cookies-next';
import { errorHandler } from '../api/errorHandler';

const KEY = process.env.DB_TOKEN_KEY;
//fetch data from db
export async function getServerSideProps({req}) {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_ALL_USERS, {
      headers: {
        Cookie: req.headers.cookie
      }
    });
    //Redirect to loginPage
    if(res.status != 200) {
      return {
        redirect: {
          permament: false,
          destination: "/loginPage",
        },
        props: {},
      };
    }

    const cook = getCookies({ req, res }).token;
    console.log(res.status);
    const data = await res.json();

    if (!data) {
      return { notFound: true, };
    }  
    return { props: {data}  };

  } catch (err) {
      console.log('Error message during fetching the user data: ' + err);
  }
}

export default function newRec() {
  const [value, setValue] = React.useState(null);
  const router = useRouter();
  const [selection, setSelection] = React.useState();

  const saveData = async () => {

    console.log(lastname_tf.value, firstname_tf.value, selection, value);

    try {
      const requestData = {
        method: 'POST',
        body: JSON.stringify ({ last_name: lastname_tf.value,
                              first_name: firstname_tf.value,
                              is_active: selection,
                              date_of_birth: value
                            }),
        headers: { 'Content-Type': 'application/json' }
      };
      const res = await fetch(process.env.NEXT_PUBLIC_ALL_USERS, requestData);
    } catch (err) {
        console.log('Error message during saving the changes: ' + err);
    }
    
    return ( router.push('/') );
  };
  return (
    <Container maxWidth='sm'>
        <Head>
            New Record
        </Head>
        <p>Μέλη Συμβουλίου</p>
        <TextField id="lastname_tf" 
            label="Επώνυμο" 
            variant="standard" />
        <br />
        <TextField id="firstname_tf" 
            label="Όνομα" 
            variant="standard" />
        <br />
        <br />
        <FormControl component="fieldset">
        <FormLabel id="active" 
            component="legend">Είναι Ενεργός?</FormLabel>
        <RadioGroup row 
            aria-label="active" 
            name="row-radio-buttons-group">
            <FormControlLabel value="TRUE" 
                control={<Radio />} 
                label="Ναι" 
                onClick={() => setSelection('TRUE')} />
            <FormControlLabel value="FALSE" 
                control={<Radio />} 
                label="Όχι" 
                onClick={() => setSelection('FALSE')} />
        </RadioGroup>
        </FormControl>
        <br />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                label="Ημερομηνία Γέννησης"
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
        <br />
        <br />
        <Button onClick={() => router.push('/')}>
            Ακύρωση
        </Button>
        <Button onClick={saveData}>
            Αποθήκευση
        </Button>
    </Container>  
  );
}