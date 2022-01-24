import React, { useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import Container from "@mui/material/Container";
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link'
import { useRouter } from 'next/router'

//fetch data from db
export async function getServerSideProps() {
  const res = await fetch('http://localhost:3001/users')
  const data = await res.json()
  
  console.log(data);
  if (!data) {
    return { notFound: true, }
  }  
  return { props: {data}  }
}

export default function Home( { data } ) {
  const [value, setValue] = React.useState(null);  
  const [rows, setRows] = React.useState(data);
  const [getId, setGetId] = React.useState(data) 
  const router = useRouter()

  const columns = [
    { field: 'id', headerName: 'ID', width: 50, hide: true},
    { field: 'btn', 
      headerName: 'Διαγραφή',
      width: 80,
      sortable: false,
      renderCell: (data) => {
      return <IconButton aria-label="delete" 
               onClick={ async () => {
                 console.log('User with id: '+ data.id+' was deleted')
                 const deleteData = {
                   method:'DELETE',
                   body: JSON.stringify({id: data.id}),
                   headers: { 'Content-Type': 'application/json' }
                 };
                 const delRes = await fetch(`http://localhost:3001/users/${data.id}`, deleteData);
                 router.push('/')
               }} >
               <DeleteIcon />
             </IconButton> 
    }},
    { field: 'edt', 
      headerName: 'Επεξεργασία',
      width: 80,
      sortable: false,
      renderCell: (data) => {
      // you will find row info in params
      return <IconButton aria-label="edit" 
                onClick={ async() => { 
                  const userRes = await fetch(`http://localhost:3001/users/${parseInt(data.id)}`)
                  const datUser = await userRes.json()
                  //const userId = props.datUser[0].id 
                  console.log(datUser[0].last_name)
                  
                  router.push({
                    pathname: '/actions/editRecord',
                    query: {id: datUser[0].id }})
                  }} > 
                <EditIcon />
             </IconButton> 
    }},
    { field: 'last_name', headerName: 'Επώνυμο', width: 150},
    { field: 'first_name', headerName: 'Όνομα', width: 100},
    { field: 'is_active', headerName: 'Ενεργός', width: 80, type: 'boolean' },
    { field: 'date_of_birth', headerName: 'Ημερομηνία Γέννησης', width: 150, type: 'date' },
    { field: 'full', headerName: 'Ονοματεπώνυμο', width: 200,
      valueGetter: (params) =>
        `${params.row.first_name || ''} ${params.row.last_name || ''}`,
    }
  ];

  const newRec = () => {
    //<Link href="/actions/newRecord" />   
    return router.push('/actions/newRecord')
  }

  return (
    <Container maxWidth="md">
      <Head> 
        <title>CRUD Project</title>
      </Head>
      <h1> Μέλη Δημοτικού Συμβουλίου</h1>
      <p>Στον παρακάτω πίνακα αναγράφονται τα μέλη του δημοτικού συμβουλίου του δήμου Πατρέων</p>
      
      <Button size="small" onClick={newRec}>
        Νέα Εγγραφή
    </Button>
      <div style = {{ height: 400, width:'100%'}} >
        <DataGrid
          aria-label = 'emp-grid'
          rows={data} 
          columns={columns}
        />
      </div>
    </Container>
  )
}
