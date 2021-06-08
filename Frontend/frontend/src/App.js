import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Switch } from "react-router-dom"

import isLoggedIn from './loginCookie/login'

//Routes
import { PublicRoute, ProtectedRoute }from './components'

//Componentes visuais
import { Landing, FormRegisto } from './components'

//import { Navbar, RegisterForm, LandingPage, Pacientes, Categorias, Paciente, Categoria, InserirPaciente, InserirCategoria, Footer } from "./components"

function App(){
    //Flag que indica se o user está autenticado
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
                    <PublicRoute isAuth={isAuth} ComponentToRender={Landing} exact path="/"/>
                    <PublicRoute isAuth={isAuth} ComponentToRender={FormRegisto} exact path="/registo"/>
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