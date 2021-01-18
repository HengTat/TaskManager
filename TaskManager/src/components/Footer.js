import React, { Component } from 'react'
import {MDBFooter} from 'mdbreact'

class Footer extends Component{
    render(){
        return (
          <footer
            class=" text-white text-center text-lg-start"
            style={{
              position: "absolute",
              backgroundColor: "rgb(235, 64, 52)",
              bottom: "0",
              width: "100%",
              color: "white",
              marginTop:"500px"
            }}
          >
            <p>
              <span style={{ margin: "400px", fontSize: "25px" }}>
                “Don't let yesterday take up too much of today.”
              </span>
            </p>
            <div
              class="text-center p-3"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            >
              <a class="text-white" href="https://mdbootstrap.com/">
                Task Manager
              </a>
            </div>
          </footer>
        );
    }
}

export default Footer;