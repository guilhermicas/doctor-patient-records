import Cookies from 'js-cookie'

function isLoggedIn (){
    return Cookies.get("session") ? true : false
}

export default isLoggedIn