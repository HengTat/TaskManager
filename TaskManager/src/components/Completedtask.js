import React, { Component } from 'react'
import {
  MDBDataTable,
  MDBIcon,
  MDBCard,
  MDBContainer,
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBInput
} from "mdbreact";
import axios from "axios";
import config from "../config"

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
      label: "Completed Date",
      field: "completeddate",
      sort: "asc",
      width: 270,
    },
    {
      label: "Status",
      field: "status",
      sort: "asc",
      width: 270,
    },
  ],
  rows: [
  ],
};


class completed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      loading: true,
    };
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  Deletedata =() =>{
    this.setState({ loading: true });
    this.deletedata().then(()=>{
      this.componentDidMount();
      this.render();
    })

  }

  async deletedata(){
    await axios.delete(config.apiserver + "/task/deletealldata").then(() => {
      this.setState({
        modal: !this.state.modal,
      });
    });
  }

  async componentDidMount() {
    var completedtasklist = [];
    await axios
      .get(config.apiserver + "/task/allcompletedtask")
      .then((data) => {
        completedtasklist = data.data;
      });
    var i = 1;
    var x;
    for (x of completedtasklist) {
      x["number"] = i;
      i++;
      if (x["completeddate"] != null) {
        x["completeddate"] = x["completeddate"].substring(0, 10);
      }
      if (x["duedate"] != null) {
        x["duedate"] = x["duedate"].substring(0, 10);
      }
    }
    data.rows = completedtasklist;
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading === true) {
      return null;
    }

    return (
      <div>
        <MDBCard style={{ width: "100%" }}>
          <div class="row">
            <MDBIcon
              icon="calendar-check"
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
              Completed Task
            </h2>
            <MDBContainer style={{ float: "right", marginTop: "15px" }}>
              <MDBBtn
                color="danger"
                onClick={this.toggle}
                style={{ float: "right", width: "250px" }}
              >
                Reset Data
              </MDBBtn>
              <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                <MDBModalHeader toggle={this.toggle}>Reset Data</MDBModalHeader>
                <MDBModalBody>
                  <div style={{alignContent:"center", justifyContent:"center", textAlign:"center"}}>
                    <div style={{ textAlign: "center" }}>
                      <br />
                      <h4>
                        <MDBIcon icon="exclamation-triangle" className="mr-1" />
                        &nbsp;WARNING !
                      </h4>{" "}
                      <br />
                    </div>
                    <p>
                      Deleting Completed task will remove <strong>ALL</strong>
                      &nbsp;task (inclusive of pending) from the database
                      forever! All Data Analytic will also be reset. Change
                      cannot be undone.
                    </p>
                    <MDBBtn color="danger" onClick={this.Deletedata}>
                      Delete Data
                    </MDBBtn>
                  </div>
                </MDBModalBody>
                <MDBModalFooter></MDBModalFooter>
              </MDBModal>
            </MDBContainer>
          </div>
        </MDBCard>
        <MDBDataTable
          theadColor="grey"
          theadTextWhite
          striped
          bordered
          small
          fixed
          entriesOptions={[1, 5, 10]}
          entries={10}
          data={data}
        />
      </div>
    );
  }
}

export default completed;