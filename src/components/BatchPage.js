import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import uuid from 'uuid';
import MaterialTable from 'material-table';
import {Link} from "react-router-dom";

export default function BatchPage(props) {
    const objid = props.match.params.id || "";
    console.log(objid);
    const obj = useSelector(state => state.batches[objid]);
    const runs = useSelector(state => obj.runs.map(id => state.runs[id]));
    const dispatch = useDispatch();
    return (
        <MaterialTable
            title={obj.name}
            data={runs}
            columns={[
                {field: 'name', render: row => <Link to={'/run/' + row.id}>{row.name}</Link>},
                {field: 'description'},
                {field: 'date'}
            ]}
            editable={{
                onRowDelete: newData => new Promise((resolve, reject) => {
                    dispatch({
                        type: 'compose',
                        actions: [
                            {
                                type: 'pop',
                                table: 'batches',
                                field: 'runs',
                                id: obj.id
                            },
                            {
                                type: 'unset',
                                table: 'runs',
                                id: newData.id
                            }]

                    });
                    resolve();
                })
            }}
        />
    );
}
