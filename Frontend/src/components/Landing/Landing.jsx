import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';

import { useHistory } from 'react-router-dom'

import Copyright from '../Copyright/Copyright'

import useStyles from './styles'

export default function Landing({checkIsAuth}) {
  const history = useHistory()

  const [ formValues, setformValues ] = useState({
      "email":"",
      "password":""
  })

  const classes = useStyles();

  async function handleSubmit(evt){
    evt.preventDefault()

    let fetchOpts = {
        method: "POST",
        body: JSON.stringify(formValues),
        credentials: 'include',
          
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }

    console.log(formValues)
    //Tentativa de login
    let res = await fetch("http://localhost:2262/",fetchOpts)
    switch (res.status) {
        case 200:
            alert("login efetuado com sucesso")
            history.push("/pacientes")
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
  }


  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={(evt) => handleSubmit(evt)} method="post">
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(evt) => handleInputChange(evt)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(evt) => handleInputChange(evt)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Log In
            </Button>
            <Grid container justify="center">
              <Grid item>
                <Link href="/registo" variant="body2">
                  {"Não tem uma conta? Clique aqui para se registar"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}