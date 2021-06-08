import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Switch, Route} from "react-router-dom"

import isLoggedIn from './loginCookie/login'

import PublicRoute from './components/Routes/PublicRoute/PublicRoute'
import ProtectedRoute from './components/Routes/ProtectedRoute/ProtectedRoute'
import { FormRegisto } from './components'
import { Landing } from './components'

//import { Navbar, RegisterForm, LandingPage, Pacientes, Categorias, Paciente, Categoria, InserirPaciente, InserirCategoria, Footer } from "./components"

function App(){
    const [isAuth, setIsAuth]= useState(false);

    //Verifica se ha cookie de sessao e muda a flag
    useEffect(() => {
        setIsAuth(isLoggedIn())
    }, [])

    return (
        <Router>
            {/* <Navbar /> */}
            <Switch>
                {/*No login pages*/ }
                    <PublicRoute isAuth={isAuth} ComponentToRender={FormRegisto} exact path="/registo"/>
                    <PublicRoute isAuth={isAuth} ComponentToRender={Landing} exact path="/"/>
                {/*Login pages*/ }
                    <ProtectedRoute isAuth={isAuth} ComponentToRender={<h1>Listagem de pacientes</h1>} exact path="/pacientes"/>
                    <ProtectedRoute isAuth={isAuth} ComponentToRender={<h1>Informaçoes de um paciente e atualizar paciente</h1>} exact path="/paciente"/>
                    <ProtectedRoute isAuth={isAuth} ComponentToRender={<h1>Inserir Paciente</h1>} exact path="/paciente/inserir"/>

                    <ProtectedRoute isAuth={isAuth} ComponentToRender={<h1>Listagem de categorias</h1>} exact path="/categorias"/>
                    <ProtectedRoute isAuth={isAuth} ComponentToRender={<h1>Informaçoes de uma categoria e atualizar categoria</h1>} exact path="/categoria"/>
                    <ProtectedRoute isAuth={isAuth} ComponentToRender={<h1>Inserir Categoria</h1>} exact path="/categoria/inserir"/>
            </Switch>
            {/*<Footer />*/}
        </Router>
    )
}


export default App