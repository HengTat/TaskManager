import React, { Component } from 'react'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { MDBCard,MDBIcon } from "mdbreact";
import variablePie from "highcharts/modules/variable-pie.js";
import axios from 'axios';
import config from '../../config'


variablePie(Highcharts);


const options = {
  chart: {
    type: "spline",
  },
  title: {
    text: "Pending Task Due Date (Next 1 week)",
  },
  xAxis: {
    categories: [],
  },
  yAxis: {
    title: { text: "Number of Pending Task" },
  },
  series: [
    {
      name: "Next Week",
      data: [],
    },
  ],
};


const options2 = {
  chart: {
    type: "variablepie",
  },
  title: {
    text: "Pending Task by Type ",
  },
  tooltip: {
    headerFormat: "",
    pointFormat:
      '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
      "Number Of Pending Task: <b>{point.y}</b><br/>" 
      ,
  },
  series: [
    {
      minPointSize: 10,
      innerSize: "20%",
      zMin: 0,
      name: "Pending Task",
      data: [
      ],
    },
  ],
};



class todoanalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

 async componentDidMount() {
    await axios.get(config.apiserver + "/task/getpendingtaskfornextweek")
      .then((data) => {
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const values=[]
        const days=[]
        for (var i in data.data){
          values.push(data.data[i].value);
          days.push(
            ((new Date(data.data[i].date)).getDate()-1 )+" "+
            monthNames[new Date(data.data[i].date).getMonth()]
          );
        }
        days[0]=days[0]+" "+"(Tomorrow)" ;
        days[days.length - 1] = days[days.length-1] + " " + "(Next Week)";
        options.xAxis.categories=days;
        options.series[0].data = values;
      });

    await axios
      .get(config.apiserver + "/task/getpendingtaskbytype")
      .then((data) => {
        const keys = Object.keys(data.data);
        for (var x of keys) {
          const newinput = {
            name: x,
            y: data.data[x],
            z: 8,
          };
          options2.series[0].data.push(newinput);
        }
      });
      this.setState({loading:false})
  }

  render() {
    if (this.state.loading === true) {
      return null;
    }
    return (
      <div>
        <MDBCard style={{ width: "100%", textalign: "center" }}>
          <div class="row">
            <MDBIcon
              icon="chart-line"
              size="2x"
              style={{
                margin: "25px",
                color: "rgb(88,88,88)",
                marginLeft: " 40px",
              }}
            />
            <h2
              style={{
                margin: "23px",
                color: "rgb(88,88,88)",
                marginLeft: "0px",
              }}
            >
              Pending Task Analysis
            </h2>
          </div>
        </MDBCard>
        <MDBCard style={{ height: "355px" }}>
          <HighchartsReact
            containerProps={{ style: { height: "100%" } }}
            highcharts={Highcharts}
            options={options}
          />
        </MDBCard>
        <MDBCard style={{ height: "340px" }}>
          <HighchartsReact
            containerProps={{ style: { height: "100%" } }}
            highcharts={Highcharts}
            options={options2}
            style={{ width: "50%" }}
          />
        </MDBCard>
      </div>
    );
  }
}

export default todoanalysis;