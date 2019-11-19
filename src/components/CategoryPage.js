import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import uuid from 'uuid';
import MaterialTable from 'material-table';
import {useParams, Link} from "react-router-dom";

export default function CategoryPage(props) {
    const params = useParams();
    const objid = params.id || '0';
    const obj = useSelector(state => state.categories[objid]);
    const categories = useSelector(state => obj.categories.map(id => state.categories[id]));
    const batches = useSelector(state => obj.batches.map(id => state.batches[id]));
    const dispatch = useDispatch();
    return (
        <MaterialTable
            title={obj.name}
            data={categories}
            columns={[
                {title:'Name', field: 'name', render: row => <Link to={'/categories/' + row.id}>{row.name}</Link>},
                {title: 'Description', field: 'description'}
            ]}
            editable={{
                onRowAdd: newData => new Promise((resolve, reject) => {
                    const id = uuid.v4();
                    dispatch({
                        type: 'compose',
                        actions: [
                            {
                                type: 'push',
                                table: 'categories',
                                field: 'categories',
                                id: obj.id,
                                data: id
                            },
                            {
                                type: 'set',
                                table: 'categories',
                                id: id,
                                data: {...newData, id, categories: [], batches: []}
                            }]
                    });
                    resolve();
                }),
                onRowUpdate: newData => new Promise((resolve, reject) => {
                    dispatch({
                        type: 'set',
                        table: 'categories',
                        id: newData.id,
                        data: newData
                    });
                    resolve();
                }),
                onRowDelete: newData => new Promise((resolve, reject) => {
                    dispatch({
                        type: 'compose',
                        actions: [
                            {
                                type: 'pop',
                                table: 'categories',
                                field: 'categories',
                                id: obj.id,
                                data: newData.id
                            },
                            {
                                type: 'unset',
                                table: 'categories',
                                id: newData.id
                            }]

                    });
                    resolve();
                })
            }}
        />
    );
}
