import React from 'react';
import {useDispatch, useSelector} from "react-redux";

import {makeStyles, Snackbar} from "@material-ui/core";
import {amber, green} from '@material-ui/core/colors';
import IconButton from "@material-ui/core/IconButton";
import SnackbarContent from "@material-ui/core/SnackbarContent";

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';

import {action_delete} from "../store";

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const useStyles1 = makeStyles(theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        fontSize: 20,
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
}));

export default function Messages() {
    const dispatch = useDispatch();
    const messages = useSelector(state => Object.values(state.messages));
    const classes = useStyles1();
    const m = messages.length > 0 ? messages[0] : {message:"", variant: "info", id: 0};
    const Icon = variantIcon[m.variant];
    const closing = (id) => {
        if (id !== 0)
            dispatch(action_delete('messages', id));
    };
    return <Snackbar autoHideDuration={2000} open={messages.length > 0} onClose={closing}>
        <SnackbarContent
            className={classes[m.variant]}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
          <Icon className={classes.iconVariant}/>
                    {m.message}
        </span>
            }
            action={[
                <IconButton key="sbclose" aria-label="close" color="inherit" onClick={() => closing(m.id)}>
                    <CloseIcon className={classes.icon}/>
                </IconButton>,
            ]}
        /></Snackbar>;
    }
