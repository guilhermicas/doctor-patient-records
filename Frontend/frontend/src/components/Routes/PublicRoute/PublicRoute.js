import React from 'react'
import { Route, Redirect } from 'react-router-dom'

/*
A partir do rest buscamos o path etc
*/
const PublicRoute = ({isAuth, ComponentToRender: Component, ...rest}) => {
    return (
        <>
            {isAuth == true ?
                <Redirect to="/pacientes"/>
            :
                <Route {...rest} render={(props) => <Component {...props}/>}/>
            }
        </>
    )
}

export default PublicRoute