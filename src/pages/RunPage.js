import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import uuid from 'uuid';
import MaterialTable from 'material-table';
import {Link} from "react-router-dom";

export default function RunPage(props) {
    const objid = props.match.params.id || "";
    console.log(objid);
    const obj = useSelector(state => state.runs[objid]);
    const categories = obj.parents.slice(0, -1);
    const batch = obj.parents[obj.parents -1];
    return (<div style={{width: '80%'}}>
        <h1>Run: {categories.map(p => <Link to={'/categories/' + p.id}> {p.name + ' / '} </Link>)}  <Link to={'/batches/' + batch.id}> {batch.name + ' / '} </Link> {obj.name}</h1>
        <MaterialTable
            title={obj.name}
            data={obj.data}
            columns={obj.columns}
        /></div>
    );
}
