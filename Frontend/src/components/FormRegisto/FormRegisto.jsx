import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import { useHistory } from 'react-router-dom'

import useStyles from './styles'
import Copyright from '../Copyright/Copyright'

export default function SignUp() {
  const history = useHistory()
  const classes = useStyles();

  let [formValues, setformValues ] = useState({
      "nome":"",
      "email":"",
      "password":""
  })

  async function handleSubmit(evt){
    evt.preventDefault()

    let fetchOpts = {
        method: "POST",
        body: JSON.stringify(formValues),
          
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }

    console.log(formValues)
    //Tentativa de registo
    let res = await fetch("http://localhost:2262/registo",fetchOpts)
    switch (res.status) {
        case 201:
            alert("Registo efetuado com sucesso")
            history.push("/")
            break;
    
        default:
            let jsonRes = await res.json()
            alert(jsonRes.message)
            break;
    }
  }

  function handleInputChange(evt) {
    const target = evt.target;

    //Passar os valores dos inputs para um objeto para depois ser enviado num POST para login
    const value = target.value;
    const name = target.name;

    setformValues({
      ...formValues,
      [name]:value
    })
    console.log(formValues)
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Criar Conta
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit} method="post">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="nome"
                name="nome"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={(evt) => handleInputChange(evt)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(evt) => handleInputChange(evt)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(evt) => handleInputChange(evt)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Criar Conta
          </Button>
          <Grid container justify="center">
            <Grid item>
              <Link href="/" variant="body2">
                Já tem conta? Clique aqui
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
