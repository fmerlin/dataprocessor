import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import uuid from 'uuid';
import MaterialTable from 'material-table';
import {Link} from "react-router-dom";

export default function RunPage(props) {
    const objid = props.match.params.id || "";
    console.log(objid);
    const obj = useSelector(state => state.runs[objid]);
    return (
        <MaterialTable
            title={obj.name}
            data={obj.data}
            columns={obj.columns}
        />
    );
}
