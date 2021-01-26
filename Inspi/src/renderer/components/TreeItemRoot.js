import React from "react";
import { withRouter } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { withStyles, Card, IconButton, Checkbox, } from "@material-ui/core";
import PropTypes from "prop-types";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { connect } from "react-redux";
import { addCategory, addVideo, removeItem, setItemVisible, } from "../store/actions/ManifestActionCreator";

class TreeItemRoot extends React.Component {
  static propsTypes = {
    category: PropTypes.object.isRequired,
    indexes: PropTypes.object.isRequired,
    selected: PropTypes.bool,
    connectDragPreview: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    draggable: PropTypes.bool,
  };

  static defaultProps = {
    indexes: [],
    selected: false,
    draggable: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      deleteCategoryDialogVisible: false,
    };
  }

  toggleVisibility = () => {
    const isVisible =
      this.props.category.visible === undefined
        ? true
        : this.props.category.visible;

    this.props.setItemVisible(!isVisible, this.props.indexes);
  };

  renderVisibleIcon = () => {
    const isVisible =
      this.props.category.visible === undefined
        ? true
        : this.props.category.visible;

    if (isVisible) {
      return (
        <IconButton onClick={this.toggleVisibility}>
          <VisibilityIcon />
        </IconButton>
      );
    }

    return (
      <IconButton onClick={this.toggleVisibility}>
        <VisibilityOffIcon />
      </IconButton>
    );
  };

  renderCopyCheckbox = () => {
    const { classes } = this.props;
    return (
      <Checkbox
        className={classes.copyCheckbox}
        checked={this.props.category.copyEnabled}
        onChange={(e) => this.props.onChecked && this.props.onChecked(e)}
        color="primary"
      />
    );
  };

  renderContent = () => {
    const { classes, category } = this.props;

    const isVisible =
      this.props.category.visible === undefined
        ? true
        : this.props.category.visible;

    return (
      <Card
        className={classes.card}
        style={{ cursor: "default" }}
        elevation={0}
      >
        <div className={classes.cardContent}>
          {this.renderCopyCheckbox()}
          <div className={classes.cardHeader} style={{ height: "48px" }}>
            <div className={classes.content}>
              <Typography className={classes.title} gutterBottom component="h6">
                Accueil Kiosk
              </Typography>
            </div>
          </div>
          <div
            style={{
              opacity: this.props.selected ? 1 : 0,
            }}
            className={classes.overlay}
          ></div>
        </div>
        <div className={classes.items}>{this.props.children}</div>
      </Card>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.cardWrapper}>{this.renderContent()}</div>
      </div>
    );
  }
}

const styles = (theme) => ({
  cardHeader: {
    display: "flex",
    alignItems: "center",
  },
  actions: {
    marginLeft: "auto",
  },
  content: {
    marginLeft: 12,
  },
  title: {
    margin: 0,
  },
  items: {
    marginLeft: "15px",
  },
  cardWrapper: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  card: {
    width: "100%",
    cursor: "pointer",
    position: "relative",
  },
  cardContent: {
    display: "flex",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  dragPreview: {
    width: "100%",
    position: "relative",
  },
  copyCheckbox: {},
});

const mapStateToProps = (state) => {
  return state.manifest;
};

export default connect(mapStateToProps, {
  addCategory,
  addVideo,
  removeItem,
  setItemVisible,
})(withStyles(styles)(withRouter(TreeItemRoot)));
