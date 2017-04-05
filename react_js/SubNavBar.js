class DeviceNav extends React.Component {
  /* Constructor */
  constructor(props) {
    // Set Props
    super(props);
    // Set State
    var group_nav = ["Topology", "Data Usage", "Signal Strength", "Channel Interference", "DFS", "WiFi Scan"];
    this.state = { nav: group_nav};

    // Connect functions
    this.print = this.my_print.bind(this);
  }

  /* Funcitons */
  my_print(para) {
    console.log(para);
  }

  /* UI Display */
  render() {
      const listItems = this.state.nav.map((group) =>
        <li role="presentation"><a href="#">{group}</a></li>
      );
      return (
        <ul className="nav nav-tabs">
          {listItems}
        </ul>
      );
  }
}

ReactDOM.render(<DeviceNav />, document.getElementById('SubNavigator'));