import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Chatapp from './Chatapp';

//import registerServiceWorker from './registerServiceWorker';

class CollapsePanel extends Component {
  static propTypes = {
    isOpened: PropTypes.bool
  };


  static defaultProps = {
    isOpened: true
  };


  constructor(props) {
    super(props);
    this.state = {isOpened: this.props.isOpened, paragraphs: 0};
  }
  render() {
	const {isOpened, paragraphs} = this.state;
	const hideStyle = {
			  display: 'none',
	};
	// const CollapsePanelStyle = {
	//   display: '-webkit-flex',
  //     display: 'flex',
  //     'flex-direction': 'row',
  //     height: '100%',
  //     justifyContent: 'flex-end'
	// }
	// const chatMiniStyle = {
	//   width: '5%',
	//   background: '#351C75',
	//   color: '#FFFFFF',
	//   padding: '50px 5px',
	//   'font-size': '18px',
	//   textAlign: 'center'
	// };

    return (
      <div className="CollapsePanel" >

		<label className="chatMini">
		  Chat
		  <input className="input"
		      type="checkbox"
		      checked={isOpened}
		      onChange={({target: {checked}}) => this.setState({isOpened: checked})} style={hideStyle}/>
		</label>
		<div style={this.state.isOpened ? {}:hideStyle}>
	      <Chatapp> </Chatapp>
		</div>

      </div>
    );
  }
}

export default CollapsePanel;
