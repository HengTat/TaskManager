import React, { Component } from 'react'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import variablePie from "highcharts/modules/variable-pie.js";
import { MDBCard,MDBIcon} from "mdbreact";
import axios from 'axios';
import config from '../../config';

variablePie(Highcharts);

const options = {
  chart: {
    type: "spline",
  },
  title: {
    text: "Completion Rate (Past 1 week)",
  },
  xAxis: {
    categories: [],
  },
  yAxis: {
    title: { text: "Number of Task Completed" },
  },
  series: [
    {
      name: "Total Completed Task Past Week",
      data: [],
    },
    {
      name: "Total Completed Task (On Time) Past Week",
      data: [1, 0, 5, 6, 0, 2,3],
    },
    {
      name: "Total Completed Task (Late) Past Week",
      data: [1, 0, 1, 0, 0, 3,1],
    },
  ],
};

const options2 = {
  chart: {
    type: "variablepie",
  },
  title: {
    text: "Task By Number Completed and Time Taken ",
  },
  tooltip: {
    headerFormat: "",
    pointFormat:
      '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
      "Number Of Completed Task: <b>{point.y}</b><br/>",
  },
  series: [
    {
      minPointSize: 10,
      innerSize: "40%",
      zMin: 0,
      name: "countries",
      data: [
      ],
    },
  ],
};

class Completedtaskanalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  async componentDidMount() {
    await axios
      .get(config.apiserver+"/task/getcompletedtaskforpastweek")
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
        days[0]=days[0]+" "+"(Past Week)" ;
        days[days.length - 1] = days[days.length-1] + " " + "(Today)";
        options.xAxis.categories=days;
        options.series[0].data = values;
      });

      await axios.get(config.apiserver + "/task/getcompletedtaskontimeforpastweek").then((data)=>{
        const values = [];
        for (var i in data.data) {
          values.push(data.data[i].value);
        }
        options.series[1].data = values;
      });

  await axios
    .get(config.apiserver + "/task/getcompletedtasklateforpastweek")
    .then((data) => {
      const values = [];
      for (var i in data.data) {
        values.push(data.data[i].value);
      }
      options.series[2].data = values;
    });

    await axios.get(config.apiserver + "/task/getcompletedtaskbytype").then(data=>{
      const keys=Object.keys(data.data);
      for(var x of keys){
        const newinput= {
          name:x,
          y:data.data[x],
          z:1
        }
        options2.series[0].data.push(newinput);
      }
    });
    this.setState({ loading: false });
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
              Completed Task Analysis
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
          />
        </MDBCard>
      </div>
    );
  }
}

export default Completedtaskanalysis;