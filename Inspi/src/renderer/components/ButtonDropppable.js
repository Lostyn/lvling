import React from "react";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { withStyles, Button } from "@material-ui/core";

const fileTarget = {
  drop(props, monitor) {
    props.onDrop(monitor.getItem().files[0].path);
  },
};

class ButtonDroppable extends React.Component {
  static propsTypes = {
    className: PropTypes.string,
    src: PropTypes.string,
    onDrop: PropTypes.func.isRequired,
  };

  static defaultProps = {
    indexes: [],
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, connectDropTarget, isOver, canDrop } = this.props;
    return connectDropTarget(
      <div className={this.props.className}>
        <Button
          disableElevation={true}
          variant="contained"
          component="label"
          size={"small"}
          onClick={this.props.onClick}
        >
          {this.props.children}
        </Button>
      </div>
    );
  }
}

const styles = (theme) => ({});

export default DropTarget(NativeTypes.FILE, fileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  didDrop: monitor.didDrop(),
  result: monitor.getDropResult(),
}))(withStyles(styles)(ButtonDroppable));
