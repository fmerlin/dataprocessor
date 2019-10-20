import React from "react";
import {Table} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useSelector} from "react-redux";

const useStyles = makeStyles({
    root: {
        width: "100%",
        overflowX: "auto"
    },
    table: {
        minWidth: 650
    }
});

function RawTable(props) {
    const classes = useStyles();
    const tb = useSelector(state => state.tables[props.id]);
    return ( <Paper className={classes.root}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {tb.headers.map(col => <TableCell align={col.align}>col.name</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tb.rows.map(row => (
                        <TableRow key={row.name}>
                            {tb.headers.map(col => <TableCell align={col.align}>{row[col.id]}</TableCell>)}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}