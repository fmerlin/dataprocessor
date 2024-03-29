import React from 'react';
import clsx from 'clsx';
import {Provider} from 'react-redux';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import {makeStyles, MuiThemeProvider} from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";

import '../index.css';
import {theme} from '../theme';
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import Messages from "./Messages";
import {store} from '../store';
import NotFoundPage from "../pages/NotFoundPage";
import CategoryPage from "../pages/CategoryPage";
import BatchPage from "../pages/BatchPage";
import RunPage from "../pages/RunPage";

const App = () => {
    const [opened, setOpen] = React.useState(false);
    const toggleSideBar = () => { setOpen(!opened) };
    const drawerWidth = 120;
    const useStyle = makeStyles(theme => ({
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
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
                <SideBar open={opened} table='categories'/>
                <main className={clsx(classes.content, {
                    [classes.contentShift]: opened,
                })}>
                    <Switch>
                        <Route path="/categories/:id" component={CategoryPage}/>
                        <Route path="/batches/:id" component={BatchPage}/>
                        <Route path="/runs/:id" component={RunPage}/>
                        <Route exact path=""><Redirect to="/categories/0"/></Route>
                        <Route component={NotFoundPage}/>
                    </Switch>
                </main>
            </BrowserRouter>
            <Messages/>
        </MuiThemeProvider>
    </Provider>
};

export default App;
