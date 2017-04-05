class DeviceList extends React.Component {
  /* Constructor */
  constructor(props) {
    // Set Props
    super(props);
    // Set State
    var simple_device_groups = ["A_group", "B_group", "C_group", "D_group"];
    this.state = { groups: simple_device_groups};

    // Connect functions
    this.print = this.my_print.bind(this);
  }

  /* Funcitons */
  my_print(para) {
    console.log(para);
  }

  /* UI Display */
  render() {
      const listItems = this.state.groups.map((group) =>
        <a href="#" className="list-group-item" onClick={this.print.bind(null,group)}>{group}</a>
      );
      return (
          <div className="col-md-2">
            <div className="list-group">
              {listItems}
            </div>
          </div>
          <div className="col-md-10">
            <DeviceNav />
          </div>
      );
  }
}

ReactDOM.render(<DeviceList />, document.getElementById('Navigator'));