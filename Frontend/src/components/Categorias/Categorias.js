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
    const [categorias, setCategorias] = useState([])

    const classes = useStyles()

    async function fetchCategorias(){
        let res = await fetch("http://localhost:2262/categorias",{
            method:"get",
            credentials: 'include',
        }) 

        switch (res.status) {
            case 200:
                let data = await res.json()
                setCategorias(data)
                break;
        
            default:
                alert(res.status)
                break;
        }
    }

    useEffect(() => {
        fetchCategorias()
    },[])

    return (
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            {/*Listagem de Categorias*/}
                            <Typography variant="h4">Categorias</Typography>
                            <Table size="small">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Titulo</TableCell>
                                    <TableCell>Descrição</TableCell>
                                    <TableCell align="right">Cor</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {categorias.map((categoria) => (
                                    <TableRow key={categoria.categoria_id}>
                                    <TableCell>{categoria.titulo}</TableCell>
                                    <TableCell>{categoria.descricao}</TableCell>
                                    <TableCell align="right">{categoria.cor}</TableCell>
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
