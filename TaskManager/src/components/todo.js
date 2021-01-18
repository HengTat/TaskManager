import React, { Component } from "react";
import { MDBDataTable } from "mdbreact";
import {
  MDBContainer,
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBInput,
  MDBCard,
  MDBIcon
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

class todo extends Component{


  constructor(props){
    super(props);
    this.state = {
      modal: false,
      task: "",
      type: "Work",
      duedate: "",
      description: "",
      loading:true,
      
    };
  }

  handleChange=(event)=>{
    var name= event.target.name;
    var value = event.target.value;
    this.setState({[name]:value});
  }

  onSubmit=()=>{
    var newtask={task:this.state.task,type:this.state.type,duedate:this.state.duedate,description:this.state.description};
    console.log(newtask);
    axios.post(config.apiserver+'/task/createtask',newtask).then(data=>console.log(data));
    this.setState({
      modal: !this.state.modal,
    });
    this.setState({loading:true});
    this.componentDidMount();
    this.render();
  }

  onCompleted=(event)=>{
    var url=config.apiserver+"/task/completedtask/"+event.target.value
    axios.put(url).then(data=>console.log(data));
    this.setState({ loading: true });
    this.componentDidMount();
    this.render();
  }

  onDeleted=(event)=>{
    var url =
      config.apiserver+"/task/deletedtask/" + event.target.value;
    axios.put(url).then(data=>console.log(data));
    this.setState({ loading: true });
    this.componentDidMount();
    this.render();
  }


  async componentDidMount(){
    try{
          var x = [];
          await axios
            .get(config.apiserver + "/task/getallpendingtask")
            .then((data) => {
              x = data.data;
            });
          var i =1;
          var task;
          for(task of x){
            task["number"]=i;
            if (task["duedate"] !=null){
            task["duedate"] = task["duedate"].substring(0, 10);
            }
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
            i++;
          }
          data.rows = x;
          this.setState({loading:false});
    }catch (error){
      console.log(error);
    }

  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  render(){
        if (this.state.loading === true) {
          return null;
        }
        return (
          <div>
            <MDBCard style={{ width: "100%", textalign: "center" }}>
              <div class="row">
                <MDBIcon
                  icon="list-alt"
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
                  Pending Task
                </h2>
                <MDBContainer style={{ float: "right", marginTop: "15px" }}>
                  <MDBBtn
                    class="btn btn-primary"
                    onClick={this.toggle}
                    style={{ float: "right", width: "250px" }}
                  >
                    + Add Task
                  </MDBBtn>
                  <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                    <MDBModalHeader toggle={this.toggle}>
                      + Add Task
                    </MDBModalHeader>
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
                        />{" "}
                        <br />
                        <MDBBtn color="danger" onClick={this.toggle}>
                          Close
                        </MDBBtn>
                        <MDBBtn color="success" onClick={this.onSubmit}>
                          Save changes
                        </MDBBtn>
                      </form>
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
              data={data}
              entriesOptions={[1, 5, 7]}
              entries={7}
            />
          </div>
        );
    }
}

export default todo;