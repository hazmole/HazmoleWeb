React.renderComponent(
  <h1>Hello, world!</h1>,
  document.getElementById('example')
);
/*
class DeviceList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.adding       = this.adding_deco.bind(this); 
    this.state = {
      value: 'Yeee',
    }
    console.log(this.state.value);
  }
  handleChange() {
      this.setState({value: this.refs.input.value});
  }
  adding_deco() {
      return "Value_("+this.state.value+")OAO";
  }
  render() {
      return (
        <div className="DeviceList">
          <h3>Input</h3>
          <input
            type="text"
            onChange={this.handleChange}
            ref="input"
            defaultValue={this.state.value} />
          <h3>Output</h3>
          <div className="content" >{this.adding()}</div>
        </div>
      );
  }
}

ReactDOM.render(<DeviceList />, document.getElementById('Navigator'));
*/