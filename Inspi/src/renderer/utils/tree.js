const { cloneDeep } = require("lodash");

//tree need to be formated for react-tree-sortable
export function getFormatedTree(manifestObj, toChildren = true) {
  const manifest = cloneDeep(manifestObj);
  getFormatedNode(manifest, toChildren);
  return manifest;
}

function getFormatedNode(node, toChildren) {
  if (toChildren) {
    if (node.items) {
      node.type = "CATEGORY";
      node.children = [...node.items];
      delete node.items;

      for (let child of node.children) {
        getFormatedNode(child, toChildren);
      }
    } else {
      node.type = "VIDEO";
    }
    node.copyEnabled = node.visible == undefined ? true : node.visible;
    node.expanded = true;
  } else {
    if (node.children) {
      node.type = "CATEGORY";
      node.items = [...node.children];
      delete node.children;
      delete node.copyEnabled;

      for (let child of node.items) {
        getFormatedNode(child, toChildren);
      }
    } else {
      node.type = "VIDEO";
    }
    delete node.expanded;
  }
}

export function getCurrentChildFromIndexes(children, indexes) {
  let currentItem = { children };

  for (let index of indexes) {
    currentItem = currentItem.children[index];
  }

  return currentItem;
}

export function getFlatTree(tree) {
  let flat = [];
  if (tree.children) {
    for (let child of tree.children) {
      if (child.visible) {
        const childFlat = getFlatTree(child);
        flat = [...flat, ...childFlat];
      }
    }
  }

  return [...flat, tree];
}

export function browseTree(manifest, callback) {
  browseNode(manifest, callback);
  return manifest;
}

export function browseNode(node, callback) {
  if (node.children) {
    for (let child of node.children) {
      browseNode(child, callback);
    }
  }

  callback(node);
}
