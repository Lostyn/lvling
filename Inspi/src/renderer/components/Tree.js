import React from "react";
import { withRouter } from "react-router-dom";
import { withStyles, InputLabel, IconButton } from "@material-ui/core";
import TreeItemVideo from "./TreeItemVideo";
import TreeItemCategory from "./TreeItemCategory";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { connect } from "react-redux";
import { addCategory, addVideo, setManifestItems, } from "../store/actions/ManifestActionCreator";
import PropTypes from "prop-types";
import SortableTree from "react-sortable-tree";
import { getFormatedTree } from "../utils/tree";
import TreeItemRoot from "./TreeItemRoot";

class Tree extends React.Component {
  static propsTypes = {
    onItemClick: PropTypes.func,
    selectedItem: PropTypes.object,
    editMode: PropTypes.bool,
    data: PropTypes.object,
  };

  static defaultProps = {
    selectedItem: null,
    editMode: true,
    data: {
      children: [],
    },
  };

  constructor(props) {
    super(props);
  }

  handleAddCategory = () => {
    this.props.addCategory([]);
  };

  handleAddVideo = () => {
    this.props.addVideo([]);
  };

  handleSortableDataChange = (data) => {
    const { items } = getFormatedTree({ children: data }, false);
    this.props.setManifestItems(items);
  };

  getIndexesFromNode(currentNode, nodeToFind, indexes = []) {
    if (currentNode === nodeToFind) {
      return indexes;
    }

    if (currentNode.children) {
      let i = 0;
      for (let subNode of currentNode.children) {
        const found = this.getIndexesFromNode(subNode, nodeToFind, [
          ...indexes,
          i,
        ]);
        if (found !== null) {
          return found;
        }
        i++;
      }
    }

    return null;
  }

  renderTreeItem = (item, categoryIndexes) => {
    if (item.settings) {
      return (
        <TreeItemRoot
          category={item}
          onChecked={(e) => this.props.onItemChecked(null, e)}
        >
          {item.children.map((subItem, subCategoryIndex) =>
            this.renderTreeItem(subItem, [subCategoryIndex])
          )}
        </TreeItemRoot>
      );
    }

    const isVisible = item.visible == undefined ? true : item.visible;

    if (item.children && isVisible) {
      return (
        <TreeItemCategory
          selected={this.props.selectedItem === item}
          indexes={categoryIndexes}
          category={item}
          key={categoryIndexes}
          onChecked={(e) => this.props.onItemChecked(categoryIndexes, e)}
          draggable={false}
        >
          {item.children.map((subItem, subCategoryIndex) =>
            this.renderTreeItem(subItem, [...categoryIndexes, subCategoryIndex])
          )}
        </TreeItemCategory>
      );
    }

    if (isVisible) {
      return (
        <TreeItemVideo
          selected={this.props.selectedItem === item}
          indexes={categoryIndexes}
          onChecked={(e) => this.props.onItemChecked(categoryIndexes, e)}
          video={item}
          key={categoryIndexes}
          draggable={false}
        ></TreeItemVideo>
      );
    }
  };

  render() {
    const { classes, data } = this.props;
    
    if (!this.props.editMode) {
      return (
        <div className={classes.tree}>
          {this.props.children}
          {/*  {data.children.map((item, i) => this.renderTreeItem(item, [i]))} */}
          {this.renderTreeItem(data, [])}
        </div>
      );
    }

    return (
      <div className={classes.tree}>
        <div className={classes.treeHeader}>
          <div
            className={classes.rowIconGroup}
            onClick={this.handleAddCategory}
          >
            <InputLabel className={classes.buttonLabel}>
              Créer une catégorie
            </InputLabel>
            <IconButton>
              <CreateNewFolderIcon />
            </IconButton>
          </div>
          <div className={classes.rowIconGroup} onClick={this.handleAddVideo}>
            <InputLabel className={classes.buttonLabel}>
              Créer une vidéo
            </InputLabel>
            <IconButton>
              <AddBoxIcon />
            </IconButton>
          </div>
        </div>
        <SortableTree
          treeData={this.props.data.children}
          onChange={(data) => this.handleSortableDataChange(data)}
          canNodeHaveChildren={(node) => {
            return node.type !== "VIDEO";
          }}
          nodeContentRenderer={(props) => {
            const indexes = this.getIndexesFromNode(
              this.props.data,
              props.node
            );

            if (props.node.children) {
              return (
                <TreeItemCategory
                  category={props.node}
                  indexes={indexes}
                  selected={this.props.selectedItem === props.node}
                  onClick={(_) => this.props.onItemClick(props.node, indexes)}
                  {...props}
                ></TreeItemCategory>
              );
            }

            return (
              <TreeItemVideo
                selected={this.props.selectedItem === props.node}
                indexes={indexes}
                onClick={(_) => this.props.onItemClick(props.node, indexes)}
                video={props.node}
                {...props}
              ></TreeItemVideo>
            );
          }}
        ></SortableTree>
      </div>
    );
  }
}

const styles = (theme) => ({
  tree: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    marginRight: "10px",
  },
  rowIconGroup: {
    display: "flex",
    alignItems: "center",
  },
  treeHeader: {
    display: "inline-flex",
    alignItems: "center",
    marginLeft: "auto",
  },
  buttonLabel: {
    cursor: "pointer",
  },
});

const mapStateToProps = (state) => {
  return {
    ...state.manifest,
  };
};

export default connect(mapStateToProps, {
  addCategory,
  addVideo,
  setManifestItems,
})(withStyles(styles)(withRouter(Tree)));
