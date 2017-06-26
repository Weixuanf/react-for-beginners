import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class MicButton extends Component {
  constructor(props) {
    super(props);
    this.state = {active: false};
  }
  updateOutCircleClass() {
    var oc = document.querySelector("div.outCircle");

    if (oc) {
      oc.className = "outCircle1";
    } else {
      oc = document.querySelector("div.outCircle1");
      oc.className = "outCircle";
    }

    return oc;
  }
  componentDidMount() {
   this.interval = setInterval(() => this.updateOutCircleClass(), 400);
 }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    return (
      <div className="MicButton">
        <div className="outCircle">
          <div className="innerCircle">
            <i className="fa fa-microphone" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    );
  }

}
