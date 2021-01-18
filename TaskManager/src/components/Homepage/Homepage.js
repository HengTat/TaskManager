import React, { Component } from 'react';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCol,
  MDBDataTable,
  MDBIcon,
  MDBContainer,
  MDBInput,
  MDBModal,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalBody
} from "mdbreact";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import Highcharts from "highcharts";
import solidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more.js";
import axios from'axios';
import config from '../../config'

var overduetask=0;
var completedtasktoday=0;


const data = {
  columns: [
    {
      label: "",
      field: "number",
      sort: "asc",
      width: 150,
    },
    {
      label: "Task",
      field: "task",
      sort: "asc",
      width: 270,
    },
    {
      label: "Type",
      field: "type",
      sort: "asc",
      width: 270,
    },
    {
      label: "Description",
      field: "description",
      sort: "asc",
      width: 270,
    },
    {
      label: "Due Date",
      field: "duedate",
      sort: "asc",
      width: 270,
    },
    {
      label: "Status",
      field: "status",
      sort: "asc",
      width: 270,
    },
    {
      label: "Completed",
      field: "completed",
      sort: "asc",
      width: 270,
    },
    {
      label: "Delete",
      field: "delete",
      sort: "asc",
      width: 270,
    },
  ],
  rows: [
   ],
};

highchartsMore(Highcharts);
solidGauge(Highcharts);

const options = {
  chart: {
    type: "solidgauge",
    height: "50%",
    spacingLeft: 0,
    spacingRight: 0,
    events: {
      render: renderIcons,
    },
  },

  title: {
    text: "Task Completion",
    style: {
      fontSize: "24px",
    },
  },

  tooltip: {
    borderWidth: 0,
    backgroundColor: "none",
    shadow: false,
    style: {
      fontSize: "16px",
    },
    valueSuffix: "%",
    pointFormat:
      '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',
    positioner: function (labelWidth) {
      return {
        x: (this.chart.chartWidth - labelWidth) / 2,
        y: this.chart.plotHeight / 2 + 15,
      };
    },
  },

  pane: {
    startAngle: 0,
    endAngle: 360,
    background: [
      {
        // Track for Move
        outerRadius: "112%",
        innerRadius: "88%",
        backgroundColor: Highcharts.color(Highcharts.getOptions().colors[0])
          .setOpacity(0.3)
          .get(),
        borderWidth: 0,
      },
      {
        // Track for Exercise
        outerRadius: "87%",
        innerRadius: "63%",
        backgroundColor: Highcharts.color(Highcharts.getOptions().colors[1])
          .setOpacity(0.3)
          .get(),
        borderWidth: 0,
      },
      {
        // Track for Stand
        outerRadius: "62%",
        innerRadius: "38%",
        backgroundColor: Highcharts.color(Highcharts.getOptions().colors[2])
          .setOpacity(0.3)
          .get(),
        borderWidth: 0,
      },
    ],
  },

  yAxis: {
    min: 0,
    max: 100,
    lineWidth: 0,
    tickPositions: [],
  },

  plotOptions: {
    solidgauge: {
      dataLabels: {
        enabled: false,
      },
      linecap: "round",
      stickyTracking: false,
      rounded: true,
    },
  },

  series: [
    {
      name: "Month",
      data: [
        {
          color: Highcharts.getOptions().colors[0],
          radius: "112%",
          innerRadius: "88%",
          y: 0,
        },
      ],
    },
    {
      name: "Week",
      data: [
        {
          color: Highcharts.getOptions().colors[1],
          radius: "87%",
          innerRadius: "63%",
          y: 0,
        },
      ],
    },
    {
      name: "Day",
      data: [
        {
          color: Highcharts.getOptions().colors[2],
          radius: "62%",
          innerRadius: "38%",
          y: 0,
        },
      ],
    },
  ],
};

function renderIcons() {
  // Move icon
  if (!this.series[0].icon) {
    this.series[0].icon = this.renderer
      .path(["M", -8, 0, "L", 8, 0, "M", 0, -8, "L", 8, 0, 0, 8])
      .attr({
        stroke: "#303030",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": 2,
        zIndex: 10,
      })
      .add(this.series[2].group);
  }
  this.series[0].icon.translate(
    this.chartWidth / 2 - 10,
    this.plotHeight / 2 -
      this.series[0].points[0].shapeArgs.innerR -
      (this.series[0].points[0].shapeArgs.r -
        this.series[0].points[0].shapeArgs.innerR) /
        2
  );

  // Exercise icon
  if (!this.series[1].icon) {
    this.series[1].icon = this.renderer
      .path([
        "M",
        -8,
        0,
        "L",
        8,
        0,
        "M",
        0,
        -8,
        "L",
        8,
        0,
        0,
        8,
        "M",
        8,
        -8,
        "L",
        16,
        0,
        8,
        8,
      ])
      .attr({
        stroke: "#ffffff",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": 2,
        zIndex: 10,
      })
      .add(this.series[2].group);
  }
  this.series[1].icon.translate(
    this.chartWidth / 2 - 10,
    this.plotHeight / 2 -
      this.series[1].points[0].shapeArgs.innerR -
      (this.series[1].points[0].shapeArgs.r -
        this.series[1].points[0].shapeArgs.innerR) /
        2
  );

  // Stand icon
  if (!this.series[2].icon) {
    this.series[2].icon = this.renderer
      .path(["M", 0, 8, "L", 0, -8, "M", -8, 0, "L", 0, -8, 8, 0])
      .attr({
        stroke: "#303030",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": 2,
        zIndex: 10,
      })
      .add(this.series[2].group);
  }

  this.series[2].icon.translate(
    this.chartWidth / 2 - 10,
    this.plotHeight / 2 -
      this.series[2].points[0].shapeArgs.innerR -
      (this.series[2].points[0].shapeArgs.r -
        this.series[2].points[0].shapeArgs.innerR) /
        2
  );
}



class homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      task: "",
      type: "Work",
      duedate: "",
      description: "",
      loading: true,
    };
  }

  handleChange = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    this.setState({ [name]: value });
  };

  onSubmit = () => {
    var newtask = {
      task: this.state.task,
      type: this.state.type,
      duedate: this.state.duedate,
      description: this.state.description,
    };
    console.log(newtask);
    axios
      .post(config.apiserver + "/task/createtask", newtask)
      .then((data) => console.log(data));
    this.setState({
      modal: !this.state.modal,
    });
    this.setState({ loading: true });
    this.componentDidMount();
    this.render();
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  onCompleted = (event) => {
    this.setState({ loading: true });
    this.complete(event.target.value).then( ()=>{
    this.componentDidMount();
    this.render();
    }
    )
  };

  onDeleted = (event) => {
    this.setState({ loading: true });
    this.delete(event.target.value).then(()=>  {  
    this.componentDidMount();
    this.render();});
  };

  async delete(id){
    var url = config.apiserver + "/task/deletedtask/" + id;
    await axios.put(url).then((data) => console.log(data));
  }

  async complete(id){
    var url =config.apiserver + "/task/completedtask/" + id;
    await axios.put(url).then((data) => console.log(data));
  }

  async componentDidMount() {
    await axios
      .get(config.apiserver + "/task/numberoftaskcompletedtoday")
      .then((data) => (completedtasktoday = data.data));
    await axios
      .get(config.apiserver + "/task/numberofoverduetask")
      .then((data) => (overduetask = data.data));
    var x = [];
    await axios.get(config.apiserver + "/task/getupcomingtask").then((data) => {
      x = data.data;
    });
    var task;
    var i = 1;
    for (task of x) {
      task["number"] = i;
      i++;
      task["duedate"] = task["duedate"].substring(0, 10);
      task["completed"] = (
        <MDBBtn
          color="success"
          value={task["_id"]}
          onClick={this.onCompleted}
          size="sm"
        >
          Completed
        </MDBBtn>
      );
      task["delete"] = (
        <MDBBtn
          color="danger"
          value={task["_id"]}
          size="sm"
          onClick={this.onDeleted}
        >
          Delete
        </MDBBtn>
      );
    }

    data.rows = x;

    await axios
      .get(config.apiserver + "/task/gettaskcompletedpercentage")
      .then((data) => {
        options.series[2].data[0].y = Math.round(data.data.today);
        options.series[1].data[0].y = Math.round(data.data.oneweek);
        options.series[0].data[0].y = Math.round(data.data.onemonth);
      });

    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading === true) {
      return null;
    }
    return (
      <div>
        <div class="row">
          <div class="col">
            <div class="row" style={{ marginLeft: "30px" }}>
              <MDBCol style={{ maxWidth: "22rem" }} class="col">
                <MDBCard
                  style={{ background: "linear-gradient(#69f0ae,#00e676 )" }}
                >
                  <MDBCardBody
                    style={{
                      textAlign: "center",
                      color: "white",
                      alignContent: "center",
                    }}
                  >
                    <span>
                      <h2>Task Completed Today:</h2>
                      <br />
                      <br />
                      <p
                        style={{
                          textAlign: "center",
                          fontSize: "55px",
                          color: "white",
                        }}
                      >
                        {completedtasktoday}
                      </p>
                    </span>
                    <br />
                    <br />
                    <br />
                    <br />
                    <div>
                      <MDBBtn color="primary" href="/completedtask">
                        View All Completed >
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol style={{ maxWidth: "22rem" }} class="col">
                <MDBCard
                  style={{ background: "linear-gradient(#ff8a80 ,#ff1744)" }}
                >
                  <MDBCardBody style={{ textAlign: "center", color: "white" }}>
                    <span>
                      <h2>Number of Overdue Task:</h2>
                      <br />
                      <br />
                      <p
                        style={{
                          fontSize: "55px",
                        }}
                      >
                        {overduetask}
                      </p>
                    </span>
                    <br />
                    <br />
                    <br />
                    <br />
                    <div class="row">
                      <div>
                        <MDBContainer style={{ color: "grey" }}>
                          <MDBBtn class="btn btn-primary" onClick={this.toggle}>
                            + Add Task
                          </MDBBtn>
                        </MDBContainer>
                      </div>
                      <div>
                        <MDBBtn href="/todo">View Task ></MDBBtn>
                      </div>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </div>
            <div class="col">
              <MDBCard
                style={{
                  width: "675px",
                  height: "350px",
                  marginTop: "30px",
                  marginLeft: "27px",
                }}
              >
                <MDBCardBody>
                  <HighchartsReact highcharts={Highcharts} options={options} />
                </MDBCardBody>
              </MDBCard>
            </div>
          </div>
          <div>
            <MDBCol>
              <MDBCard style={{ height: "800px", width: "1140px" }}>
                <MDBCardBody>
                  <MDBCardTitle style={{ color: "rgb(88,88,88)" }}>
                    <MDBIcon icon="hourglass-half" />
                    &nbsp; Upcoming Task (1 Week)
                  </MDBCardTitle>
                  <MDBCardText>
                    <MDBDataTable
                      theadColor="grey"
                      theadTextWhite
                      striped
                      bordered
                      small
                      fixed
                      data={data}
                      entries={7}
                      entriesOptions={[1, 5, 7]}
                    />
                  </MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </div>
        </div>
        <MDBContainer>
          <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
            <MDBModalHeader toggle={this.toggle}>+ Add Task</MDBModalHeader>
            <MDBModalBody>
              <form className="form-group" onSubmit={this.onSubmit}>
                <label>Task Name:</label>
                <input
                  className="form-control"
                  type="text"
                  name="task"
                  onChange={this.handleChange}
                  required
                />
                <br />
                <label for="tasktype">Type:</label>
                <select
                  className="form-control"
                  id="type"
                  onChange={this.handleChange}
                  name="type"
                >
                  <option value="Work">Work</option>
                  <option value="Leisure">Leisure</option>
                  <option value="Errands">Errands</option>
                  <option value="Finance">Finance</option>
                </select>
                <br />
                <label>DueDate:</label>
                <input
                  className="form-control"
                  type="date"
                  name="duedate"
                  onChange={this.handleChange}
                  required
                />
                <br />
                <label>Task Description</label>
                <MDBInput
                  type="textarea"
                  name="description"
                  outline
                  rows="7"
                  onChange={this.handleChange}
                />
              </form>
              <br />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="danger" onClick={this.toggle}>
                Close
              </MDBBtn>
              <MDBBtn color="success" onClick={this.onSubmit}>
                Save changes
              </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        </MDBContainer>
      </div>
    );
  }
}

export default homepage;