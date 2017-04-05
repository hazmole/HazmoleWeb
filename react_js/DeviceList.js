
// 2017.04.06 - Hazmole modified
//===================================
// DeviceList
//===================================
class DeviceList extends React.Component {
  /* Constructor */
  constructor(props) {
    // Set Props
    super(props);
    // Set State
    this.state = {
      "groups": [],
      "selected_type": null,
      "selected_id": null
    };
    this.interval = null;
    // Connect functions
    this.print = this.my_print.bind(this);
    this.updateList = this.updateDeviceGroups.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    
  }
  /* Funcitons */
  updateDeviceGroups(){
    var simple_groups = [
      {"Id":"A_Groups", "Devices":[
        {"Id": "Hallway", "Clients": [
          {"Id": "moible-01"}
        ]},
        {"Id": "Kitchen", "Clients": []}
      ]},
      {"Id":"B_Groups", "Devices":[
        {"Id": "Grave", "Clients": [
          {"Id": "ghost_moible-1"},
          {"Id": "ghost_moible-2"},
          {"Id": "ghost_laptop"},
        ]}
      ]}
    ];
    this.setState({"groups": simple_groups});
  }
  handleSelect(type, object_id){
    //console.log(type, object_id);
    this.setState({
      "selected_type": type,
      "selected_id": object_id
    });
  }
  my_print(para) {
    console.log(para);
  }

  componentDidMount() {
    this.updateList();
//    this.interval = setInterval( this.updateList, 5000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  /* UI Display */
  render() {
      const listItems = [];
      $.each(this.state.groups, function(key, group){
        // Render Group
        listItems.push(<a href="#" className="list-group-item"
         onClick={this.handleSelect.bind(null, "group", group.Id)}>{group.Id}</a>);
        $.each(group.Devices, function(key, device){
          // Render Device
          listItems.push(<a href="#" className="list-group-item" style={{"background":"#d2cffb"}}
           onClick={this.handleSelect.bind(null, "device", device.Id)}> -{device.Id}</a>);
          $.each(device.Clients, function(key, client){
            listItems.push(<a href="#" className="list-group-item" style={{"background":"#b5b0f9"}}
              onClick={this.handleSelect.bind(null, "client", client.Id)}> --{client.Id}</a>);
          }.bind(this));
        }.bind(this));
      }.bind(this));

      return (
        <div className="DeviceList">
          <div className="col-md-2">
            <div id="Navigator">{listItems}</div>
          </div>
          <div className="col-md-10">
            //<DeviceNav data-sel_type={this.state.selected_type} data-sel_id={this.state.selected_id} />
          </div>
        </div>
      );
  }
}
ReactDOM.render(<DeviceList />, document.getElementById('Main'));