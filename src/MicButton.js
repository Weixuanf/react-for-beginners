import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class MicButton extends Component {
  constructor(props) {
    super(props);
    this.state = {active: false};
  }
  render() {
    return (
      <div className="MicButton">
        <div className="outCircle">
          <div className="innerCircle">
            <i class="fa fa-microphone" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    );
  }

}
