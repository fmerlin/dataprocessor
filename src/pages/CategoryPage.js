import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import uuid from 'uuid';
import MaterialTable from 'material-table';
import {useParams, Link} from "react-router-dom";
import {action_add_ref, action_del_ref, action_set} from '../store';
import {Chip, Paper, Typography, withStyles} from "@material-ui/core";
import {emphasize} from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";


export default function CategoryPage(props) {
    const params = useParams();
    const objid = params.id || '0';
    const obj = useSelector(state => state.categories[objid]);
    const categories = useSelector(state => obj.categories.map(id => state.categories[id]));
    const batches = useSelector(state => obj.batches.map(id => state.batches[id]));
    const dispatch = useDispatch();
    return (
        <div style={{width: '80%'}}>
            <h1><span style={{display:'flex'}}>Category: <Breadcrumbs aria-label="breadcrumb" style={{marginLeft: 'auto'}}>
                {obj.parents.map(p => <Chip component={Link} to={'/categories/' + p.id} clickable={true} color='primary' label={p.name} style={{fontSize :'larger'}}/>)}
                    <Chip label={obj.name} style={{fontSize :'larger'}}/>
            </Breadcrumbs></span>
            </h1>
            <Paper style={{padding:'1em', marginTop: '2em'}}>{obj.description}</Paper>
            <h3 style={{borderBottom: 'solid 1px black', marginTop: '2em'}}>Add Sub Categories</h3>
            <MaterialTable
                title='Sub Categories'
                data={categories}
                columns={[
                    {title: 'Name', field: 'name', render: row => <Chip component={Link} to={'/categories/' + row.id}  clickable={true} color='primary' label={row.name}/>},
                    {title: 'Description', field: 'description'}
                ]}
                editable={{
                    onRowAdd: newData => new Promise((resolve, reject) => {
                        const id = uuid.v4();
                        dispatch(action_add_ref('categories', obj.id, 'categories', 'categories', id, {
                            ...newData,
                            id,
                            categories: [],
                            batches: [],
                            parents: [...obj.parents, {id: obj.id, name: obj.name}]
                        }));
                        resolve();
                    }),
                    onRowUpdate: newData => new Promise((resolve, reject) => {
                        dispatch(action_set('categories', newData.id, newData));
                        resolve();
                    }),
                    onRowDelete: newData => new Promise((resolve, reject) => {
                        dispatch(action_del_ref('categories', obj.id, 'categories', 'categories', newData.id));
                        resolve();
                    })
                }}
            />
            <h3 style={{borderBottom: 'solid 1px black', marginTop: '2em'}}>Add Batches</h3>
            <MaterialTable
                title='Batches'
                data={batches}
                columns={[
                    {title: 'Name', field: 'name', render: row => <Chip component={Link} to={'/batches/' + row.id}  clickable={true} color='primary' label={row.name}/>},
                    {title: 'Description', field: 'description'},
                    {title: 'Code', field: 'code'}
                ]}
                editable={{
                    onRowAdd: newData => new Promise((resolve, reject) => {
                        const id = uuid.v4();
                        dispatch(action_add_ref('categories', obj.id, 'batches', 'batches', id, {
                            ...newData,
                            id,
                            runs: [],
                            parents: [...obj.parents, {id: obj.id, name: obj.name}]
                        }));
                        resolve();
                    }),
                    onRowUpdate: newData => new Promise((resolve, reject) => {
                        dispatch(action_set('batches', newData.id, newData));
                        resolve();
                    }),
                    onRowDelete: newData => new Promise((resolve, reject) => {
                        dispatch(action_del_ref('categories', obj.id, 'batches', 'batches', newData.id));
                        resolve();
                    })
                }}
            />
        </div>
    );
}
