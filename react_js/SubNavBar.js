
// 2017.04.06 - Hazmole modified
//===================================
// DeviceNav
//===================================
class DeviceNav extends React.Component {
  /* Constructor */
  constructor(props) {
    // Set Props
    super(props);
    // Set State
    this.state = { 
      "selected": "default"
    };

    // Connect functions
    this.handleSelect = this.handleSelect.bind(this);
  }

  /* Funcitons */
  handleSelect(selected_info) {
    this.setState({"selected": selected_info});
  }

  componentWillReceiveProps(nextProps, nextState){
    this.setState({"selected": "default"});
  }
  /* UI Display */
  render() {
      var nav_bar = null;
      if(this.props["data-sel_type"]=="group")
        nav_bar = ["Topology", "Data Usage", "Signal Strength", "Channel Interference", "DFS", "WiFi Scan"];
      else if(this.props["data-sel_type"]!=null)
        nav_bar = ["Data Usage", "Signal Strength", "Diagnose"];
      else
        nav_bar = [];

      const listItems = nav_bar.map((group) =>
        <li role="presentation"><a href="#" onClick={this.handleSelect.bind(null,group)}>{group}</a></li>
      );
      return (
        <div>
          <ul className="nav nav-tabs">
            {listItems}
          </ul>
          <MainContent name={this.state.selected}/>
        </div>
      );
  }
}