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
import { getCookies } from 'cookies-next';

export async function getServerSideProps(context) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_ALL_USERS}/${context.query.id}`
  , {
    headers: {
      Cookie: context.req.headers.cookie
    }
   }
  );
  console.log(res.status);
  console.log(getCookies(context.req.headers.cookie));
  if(res.status != 200) {
    return {
      redirect: {
        permament: false,
        destination: "/loginPage",
      },
      props: {},
    };
  }
  //console.log(getCookies({ context, res }).token)
  const data = await res.json();
  //console.log(data);
  if (!data) {
    return { notFound: true, };
  }  
  return { props: {data}  }  ;
}

export default function newRec( { data } ) {
    const [value, setValue] = React.useState(null);
    const [selection, setSelection] = React.useState();
    const [gtUser, setGtUser] = React.useState(data[0]);
    const router = useRouter();

    const onChange = (e, fld) => {
      if ( fld !== 'date_of_birth' ) {
          let tmp = {...gtUser};
          tmp[fld] = e.target.value;
          setGtUser(tmp);
      } else {
          let tmp = {...gtUser};
          tmp[fld] = e.toISOString();
          setGtUser(tmp);
      }
    };
    
    const saveData = async () => {
      console.log(new Date (gtUser.date_of_birth).toLocaleDateString());
      const newDate = new Date (gtUser.date_of_birth).toLocaleDateString();
      const requestData = {
        method: 'PUT',
        body: JSON.stringify ({ last_name: gtUser.last_name,
                               first_name: gtUser.first_name,
                               is_active: gtUser.is_active,
                               date_of_birth: newDate,
                               id: router.query.id
                             }),
        headers: { 'Content-Type': 'application/json' }
      };
      const res = await fetch(process.env.NEXT_PUBLIC_ALL_USERS, requestData);
  
      return ( router.push('/') );
    };
    return (
      <Container maxWidth='sm'>
          <Head>
              Edit Record
          </Head>
          <p>Μέλη Συμβουλίου προς επεξεργασία</p>
          <TextField id="lastname_tf" 
              label="Επώνυμο"
              variant="standard"
              value={gtUser.last_name}
              onChange={e =>onChange(e, "last_name")} />
          <br />
          <TextField id="firstname_tf" 
              label="Όνομα" 
              variant="standard" 
              value={gtUser.first_name} 
              onChange={e =>onChange(e, "first_name")}/>
          <br />
          <br />
          <FormControl component="fieldset">
            <FormLabel id="active" 
                component="legend">Είναι Ενεργός?</FormLabel>
            <RadioGroup row 
                aria-label="active" 
                name="row-radio-buttons-group" 
                value={gtUser.is_active}>
                <FormControlLabel value="true" 
                    control={<Radio />} 
                    label="Ναι"  
                    onChange={e =>onChange(e, "is_active")} 
                    onClick={() => setSelection('TRUE') } />
                <FormControlLabel value="false" 
                    control={<Radio />} 
                    label="Όχι" 
                    onChange={e =>onChange(e, "is_active")} 
                    onClick={() => setSelection('FALSE')} />
            </RadioGroup>
          </FormControl>
          <br />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                  label="Ημερομηνία Γέννησης"
                  value={gtUser.date_of_birth}
                  inputFormat="dd/MM/yyyy"
                  onChange={e =>onChange(e, "date_of_birth")}
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