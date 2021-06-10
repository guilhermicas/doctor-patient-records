import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

//Componentes visuais
import { Navbar, Landing, FormRegisto, DashBoardNav } from './components'

import Orders from './components/DashBoardNav/Orders/Orders'

//import { Navbar, RegisterForm, LandingPage, Pacientes, Categorias, Paciente, Categoria, InserirPaciente, InserirCategoria, Footer } from "./components"

function App(){
    return (
        <Router>
            <Switch>
                {/*No login pages*/ }
                    <Route exact path = "/">
                        <Navbar/>
                        <Landing/>
                    </Route>
                    <Route exact path = "/registo">
                        <Navbar/>
                        <FormRegisto/>
                    </Route>
                {/*Login pages*/ }
                    <Route render={() => <DashBoardNav PageComponent={Orders}/>} exact path = "/pacientes"/>
                    <Route render={() => <DashBoardNav/>} exact path = "/paciente"/>
                    <Route render={() => <DashBoardNav/>} exact path = "/paciente/inserir"/>

                    <Route render={() => <DashBoardNav/>} exact path = "/categorias"/>
                    <Route render={() => <DashBoardNav/>} exact path = "/categoria"/>
                    <Route render={() => <DashBoardNav/>} exact path = "/categoria/inserir"/>

                    <Route render={() => <DashBoardNav/>} exact path = "/conta"/>
            </Switch>
            {/*<Footer />*/}
        </Router>
    )
}

/*
                    <DashBoardNav />
                    <Route render={<h1>Dashboard</h1>} exact path="/dashboard"/>
                    <Route render={<h1>Conta</h1>} exact path="/conta"/>

                    <Route render={<h1>Listagem de pacientes</h1>} exact path="/pacientes"/>
                    <Route render={<h1>Informaçoes de um paciente e atualizar paciente</h1>} exact path="/paciente"/>
                    <Route render={<h1>Inserir Paciente</h1>} exact path="/paciente/inserir"/>

                    <Route render={<h1>Listagem de categorias</h1>} exact path="/categorias"/>
                    <Route render={<h1>Informaçoes de uma categoria e atualizar categoria</h1>} exact path="/categoria"/>
                    <Route render={<h1>Inserir Categoria</h1>} exact path="/categoria/inserir"/>
*/

export default App