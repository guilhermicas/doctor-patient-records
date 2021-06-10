import {makeStyles} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    RedirectButton: {
        color:"#FFFFFF",
        textDecorationStyle:"none"
    }
  }));

export default useStyles