import React from "react";
import { withRouter } from "react-router-dom";
import { withStyles, Card } from "@material-ui/core";
import VideoEdit from "../components/VideoEdit";
import Tree from "../components/Tree";
import CategoryEdit from "../components/CategoryEdit";
import { connect } from "react-redux";
import { getFormatedTree } from "../utils/tree";

class Contents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItemIndexes: [],
    };
  }

  handleSetCurrentItem = (item, indexes) => {
    this.setState({
      currentItemIndexes: indexes,
    });
  };

  renderEdit = () => {
    const item = this.currentItem;
    if (item.items) {
      return (
        <CategoryEdit
          key={this.state.currentItemIndexes}
          indexes={this.state.currentItemIndexes}
          category={item}
        ></CategoryEdit>
      );
    }

    return (
      <VideoEdit
        key={this.state.currentItemIndexes}
        indexes={this.state.currentItemIndexes}
        video={item}
      ></VideoEdit>
    );
  };

  get currentItem() {
    if (this.state.currentItemIndexes.length === 0) {
      return;
    }

    const items = [...this.props.items];

    //in case selected item has been deleted
    try {
      let currentItem = { items };

      for (let index of this.state.currentItemIndexes) {
        currentItem = currentItem.items[index];
      }

      return currentItem;
    } catch (e) {
      return null;
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.home}>
          <Tree
            data={this.props.formatedManifest}
            selectedItem={this.currentItem}
            onItemClick={this.handleSetCurrentItem}
          ></Tree>
          <Card square={true} className={classes.card}>
            {this.currentItem && this.renderEdit()}
          </Card>
      </div>
    );
  }
}

const styles = (theme) => ({
  card: {
    flex: 0.4,
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll",
  },
  home: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  formItem: {
    marginTop: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  previewImage: {
    width: "300px",
    height: "300px",
    border: "solid rgba(0,0,0,0.05) 1px",
  },
  previewButton: {
    marginTop: "10px",
  },
});

const mapStateToProps = (state) => {
  return {
    ...state.manifest,
    formatedManifest: getFormatedTree(state.manifest),
  };
};

export default connect(
  mapStateToProps,
  {}
)(withStyles(styles)(withRouter(Contents)));
