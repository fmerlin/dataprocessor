import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import {makeStyles} from '@material-ui/core/styles';
import SideBarItem from "./SideBarItem";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    drawerPaper: {
        top: "auto",
        width: drawerWidth,
    }
}));

function ResponsiveDrawer(props) {
    const classes = useStyles();

    return <nav className={classes.drawer}>
        <Drawer
            classes={{
                paper: classes.drawerPaper,
            }}
            variant="persistent"
            open={props.open}
        >
            <List>
                {props.menuItems.map(e => <SideBarItem id={e}/>)}
            </List>
        </Drawer>
    </nav>;
}

ResponsiveDrawer.propTypes = {
    open: PropTypes.bool,
    menuItems: PropTypes.array,
};

export default ResponsiveDrawer;
