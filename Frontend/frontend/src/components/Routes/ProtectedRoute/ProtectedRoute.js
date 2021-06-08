import React from 'react'
import { Route, Redirect } from 'react-router-dom'

/*
A partir do rest buscamos o path etc
*/
const ProtectedRoute = ({isAuth, ComponentToRender: Component, ...rest}) => {
    return (
        <>
            {isAuth === false ?
                <Redirect to="/"/>
            :
                <Route {...rest} render={(props) => <Component {...props}/>}/>
            }
        </>
    )
}

export default ProtectedRoute