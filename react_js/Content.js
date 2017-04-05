class MainContent extends React.Component {
  /* Constructor */
  constructor(props) {
    // Set Props
    super(props);
    ;
  }

  /* UI Display */
  render() {
      return (
        <div className="MainContent">
          <div className="list-group">
            Page: {this.props.name}
          </div>
        </div>
      );
  }
}
