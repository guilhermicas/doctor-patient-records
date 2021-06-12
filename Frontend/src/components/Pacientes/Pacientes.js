import React, { useState, useEffect } from 'react'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

import Copyright from '../Copyright/Copyright';

import useStyles from './styles'

const Pacientes = () => {
    const [pacientes, setPacientes] = useState([])

    const classes = useStyles()

    async function fetchPacientes(){
        let res = await fetch("http://localhost:2262/pacientes",{
            method:"get",
            credentials: 'include',
        }) 

        switch (res.status) {
            case 200:
                let data = await res.json()
                setPacientes(data)
                break;
        
            default:
                alert(res.status)
                break;
        }
    }

    useEffect(() => {
        fetchPacientes()
    },[])

    return (
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            {/*Listagem de Pacientes*/}
                            <Typography variant="h4">Pacientes</Typography>
                            <Table size="small">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Descrição</TableCell>
                                    <TableCell align="right">Data de Criação</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {pacientes.map((paciente) => (
                                    <TableRow key={paciente.paciente_id}>
                                    <TableCell>{paciente.nome}</TableCell>
                                    <TableCell>{paciente.descricao}</TableCell>
                                    <TableCell align="right">{paciente.created_at}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
                <Box pt={4}>
                    <Copyright />
                </Box>
            </Container>
          </Paper>
        </Grid>
    )
}

export default Pacientes
