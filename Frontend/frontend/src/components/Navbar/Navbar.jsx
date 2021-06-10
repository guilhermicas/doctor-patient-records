import React, { useEffect } from 'react'
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom'


import useStyles from './styles'

const Navbar = () => {
    const classes = useStyles()

    return (
    <div className={classes.root}>
        <AppBar position="static">
            <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
                Doctor Patient Records
            </Typography>
                <Link to="/registo" className={classes.RedirectButton}>Criar Conta</Link>
            </Toolbar>
        </AppBar>
    </div>
    )
}

export default Navbar