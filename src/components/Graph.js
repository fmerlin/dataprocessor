import React from "react";
import Chart from "react-apexcharts";
import {useSelector} from "react-redux";

function Graph(props) {
    const tb = useSelector(state => state.tables[props.id]);
    return ( <Chart
            options={tb.options}
            series={tb.series}
            type="bar"
            width="500"
        />
    );
}