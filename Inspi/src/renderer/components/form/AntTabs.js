import { withStyles, Tabs, Tab } from "@material-ui/core";

export const AntTabs = withStyles({
    root: {
      minHeight: 36,
      boxShadow: 'rgba(0, 0, 0, 0.07) 0px -1px inset',
    }
})(Tabs);
  
export const AntTab = withStyles({
    root: {
      textTransform: 'none',
      fontSize: 12,
      minHeight: 36
    }
})(Tab);