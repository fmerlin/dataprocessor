import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {Link} from "react-router-dom";
import Collapse from "@material-ui/core/Collapse";
import {useDispatch, useSelector} from "react-redux";
import IconExpandLess from '@material-ui/icons/ExpandLess';
import IconExpandMore from '@material-ui/icons/ExpandMore';

function SideBarItem(props) {
    const m = useSelector(state => state.menuItems[props.id]);
    const [opened, setOpen] = React.useState(false);
    return (<>
        <ListItem button key={props.id} >
            {m.icon}&nbsp;
            <Link to={m.link}>
                <ListItemText primary={m.text}/>
            </Link>
            {opened ? <IconExpandLess onClick={setOpen(false)}/> : <IconExpandMore onClick={setOpen(true)}/>}
        </ListItem>
        <Collapse in={opened} timeout="auto" unmountOnExit>
            <List>
                {m.children.map(e => <SideBarItem id={e}/>)}
            </List>
        </Collapse>
    </>
    );
}

SideBarItem.propTypes = {
    id: PropTypes.number
};

export default SideBarItem;
