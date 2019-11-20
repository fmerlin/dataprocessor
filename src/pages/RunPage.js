import React from 'react';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import {Chip} from "@material-ui/core";
import MaterialTable from 'material-table';

export default function RunPage(props) {
    const objid = props.match.params.id || "";
    const obj = useSelector(state => state.runs[objid]);
    const categories = obj.parents.slice(0, -1);
    const batch = obj.parents[obj.parents - 1];
    return (<div style={{width: '80%'}}>
            <h1><span style={{display: 'flex'}}>Run: <Breadcrumbs aria-label="breadcrumb" style={{marginLeft: 'auto'}}>
            {categories.map(p => <Chip component={Link} to={'/categories/' + p.id} clickable={true} color='primary'
                                       label={p.name} style={{fontSize: 'larger'}}/>)}
                <Chip component={Link} to={'/batches/' + batch.id} clickable={true} color='primary' label={batch.name}
                      style={{fontSize: 'larger'}}/>
            <Chip label={obj.name} style={{fontSize: 'larger'}}/>
        </Breadcrumbs></span>
            </h1>
            <MaterialTable
                title={obj.name}
                data={obj.data}
                columns={obj.columns}
            /></div>
    );
}
