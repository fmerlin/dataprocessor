import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import {makeStyles} from '@material-ui/core/styles';
import ListItem from "@material-ui/core/ListItem";
import {Link} from "react-router-dom";
import ListItemText from "@material-ui/core/ListItemText";
import {useSelector} from "react-redux";
import Collapse from "@material-ui/core/Collapse";
import CategoryIcon from '@material-ui/icons/Category';
import AssignmentIcon from '@material-ui/icons/Assignment';
import RunIcon from '@material-ui/icons/Category';
import IconExpandLess from '@material-ui/icons/ExpandLess';
import IconExpandMore from '@material-ui/icons/ExpandMore';
import {ListItemIcon} from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    drawerPaper: {
        top: "auto",
        width: drawerWidth,
    },
    iconDrawer: {
        marginLeft: "auto"
    }
}));

const icons = {
    categories: <CategoryIcon style={{margin: '0.5em'}}/>,
    batches: <AssignmentIcon style={{margin: '0.5em'}}/>,
    runs: <RunIcon style={{margin: '0.5em'}}/>
};

const subtables = {
    categories: ["categories","batches"],
    batches: ["runs"],
    runs: []
};


function SideBarItemLeaf(props) {
    const {row, table} = props;
    return (
        <ListItem button component={Link} to={`/${table}/${row.id}`}>
            <ListItemIcon>{icons[table]}</ListItemIcon>
            <ListItemText primary={row.name}/>
        </ListItem>
    );
}

function SideBarItem(props) {
    const {row, table} = props;
    const [opened, setOpen] = React.useState(false);
    return (<div>
            <ListItem button component={Link} to={`/${table}/${row.id}`}>
                <ListItemIcon>{icons[table]}</ListItemIcon>
                <ListItemText primary={row.name}/>
                {opened ? <IconExpandLess style={{marginLeft: "auto"}} onClick={() => setOpen(false)}/> : <IconExpandMore style={{marginLeft: "auto"}} onClick={() => setOpen(true)}/>}
            </ListItem>
            <Collapse in={opened} timeout="auto" unmountOnExit>
                <List>
                    {subtables[table].map(t => <SideBarGroup ids={row[t]} table={t}/>)}
                </List>
            </Collapse>
        </div>
    );
}

function SideBarGroup(props) {
    const {ids, table} = props;
    const children = useSelector(state => ids.map(id => state[table][id]));
    if (subtables[table].length > 0)
        return <div style={{marginLeft: "0.5em"}}>{children.map(child => <SideBarItem key={child.id} row={child} table={table}/>)}</div>;
    else
        return <div style={{marginLeft: "0.5em"}}>{children.map(child => <SideBarItemLeaf key={child.id} row={child} table={table}/>)}</div>;
}

function SideBar(props) {
    const classes = useStyles();
    const root = useSelector(state => state[props.table]["0"]);

    return <nav className={classes.drawer}>
        <Drawer
            classes={{
                paper: classes.drawerPaper,
            }}
            variant="persistent"
            open={props.open}
        >
            <List>
                <SideBarGroup ids={root.categories} table='categories'/>
            </List>
        </Drawer>
    </nav>;
}

SideBar.propTypes = {
    open: PropTypes.bool,
    ids: PropTypes.array,
    table: PropTypes.string,
};

export default SideBar;
