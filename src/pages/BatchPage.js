import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import {Chip, Paper} from "@material-ui/core";
import MaterialTable from 'material-table';
import {action_del_ref, action_not_implemented} from "../store";

export default function BatchPage(props) {
    const objid = props.match.params.id || "";
    const obj = useSelector(state => state.batches[objid]);
    const runs = useSelector(state => obj.runs.map(id => state.runs[id]));
    const dispatch = useDispatch();
    const handleStart = () => {
        dispatch(action_not_implemented());
    };
    return <div style={{width: '80%'}}>
        <h1><span style={{display:'flex'}}>Batch: <Breadcrumbs aria-label="breadcrumb" style={{marginLeft: 'auto'}}>
                {obj.parents.map(p => <Chip component={Link} to={'/categories/' + p.id} clickable={true} color='primary' label={p.name} style={{fontSize :'larger'}}/>)}
            <Chip label={obj.name} style={{fontSize :'larger'}}/>
            </Breadcrumbs></span>
        </h1>
        <Paper style={{padding:'1em', marginTop: '2em', display:'flex'}}>{obj.description}
            <Button variant="contained" color="primary" style={{marginLeft: 'auto'}} onClick={handleStart}>Start</Button>
        </Paper>
        <h3 style={{borderBottom: 'solid 1px black', marginTop: '2em'}}>Runs</h3>
        <MaterialTable
            title='Runs'
            data={runs}
            columns={[
                {title: 'Name', field: 'name', render: row => <Chip component={Link} to={'/runs/' + row.id}  clickable={true} color='primary' label={row.name}/>},
                {title: 'Description', field: 'description'},
                {title: 'Date', field: 'date'},
                {title: 'Progress', field: 'progress'},
            ]}
            editable={{
                onRowDelete: newData => new Promise((resolve, reject) => {
                    dispatch(action_del_ref('batches', obj.id, 'runs', 'runs', newData.id));
                    resolve();
                })
            }}
        />
    </div>;
}
