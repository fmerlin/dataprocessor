import React from 'react';
import clsx from 'clsx';
import {Provider} from 'react-redux';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {makeStyles, MuiThemeProvider} from '@material-ui/core/styles';
import '../index.css';
import {theme} from '../theme';
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import Messages from "./Messages";
import {store} from '../store';
import LoginPage from "./LoginPage";
import NotFoundPage from "./NotFoundPage";
import CssBaseline from "@material-ui/core/CssBaseline";
import {BlurOn} from "@material-ui/icons";

const App = () => {
    const [opened, setOpen] = React.useState(false);
    const toggleSideBar = () => { setOpen(!opened) };
    const menuItems = [{id: 1, text: 'Login', link: '/login', icon: <BlurOn/>}];
    const drawerWidth = 240;
    const useStyle = makeStyles(theme => ({
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: 0,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: drawerWidth,
        },
    }));
    const classes = useStyle();

    return <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            <TopBar handleMenuClick={toggleSideBar}/>
            <BrowserRouter>
                <SideBar open={opened} menuItems={menuItems}/>
                <main className={clsx(classes.content, {
                    [classes.contentShift]: opened,
                })}>
                    <Switch>
                        <Route path="/login" component={LoginPage}/>
                        <Route component={NotFoundPage}/>
                    </Switch>
                </main>
            </BrowserRouter>
            <Messages/>
        </MuiThemeProvider>
    </Provider>
};

export default App;
