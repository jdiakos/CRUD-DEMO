import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"
import React, { useState } from 'react'
import Head from "next/head"
import { Button } from "@mui/material"
import jwt from "jsonwebtoken"
import { useRouter } from 'next/router'
import { setCookies, getCookies } from 'cookies-next'

export default function Home () {
    const router = useRouter()
    const [username, setUsername] = React.useState()
    const [password, setPassword] = React.useState()
    const [open, setOpen] = React.useState(false)

    async function submit () {
        const res = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        }).then((t) => t.json())

        const token = res.token
        console.log(res.status)
        if(token != 'No auth') {
            setCookies('token', token)
            console.log(token)
            console.log(jwt.decode(token))
            console.log(getCookies())
            router.push('/')
        } else { alert('No authentication')}
    }

    return (
        <Container maxWidth = "md">
            <Head>Login</Head>
            <h3>Καλωσήρθατε στο Δημοτικό Συμβούλιο Πατρων</h3>
            <TextField id="username" label="Username" name="username" variant="standard" onChange={e =>setUsername(e.target.value)} required={true} />
            <br />
            <TextField id="password" label="Password" name="password" variant="standard" type="password" onChange={e =>setPassword(e.target.value)} required={true} />
            <br />
            <br />
            <Button variant="contained" onClick={submit} > Είσοδος </Button>
        </Container>
    )
}