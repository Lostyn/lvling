import React from "react";
import { withRouter } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {
  withStyles,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Slider,
} from "@material-ui/core";
import { connect } from "react-redux";
import { CommandService } from "../core/services/CommandService";
import { CommandId } from "../core/commands";
import classNames from "classnames";
import { withServices } from "../core/services/serviceContext";

const DEFAULT_PROJET_ROUTE = "/videos";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  /*
  openProject = (filePath) => CommandService.executeCommand(CommandId.OPEN, filePath);
  createProject = () => CommandService.executeCommand(CommandId.NEW);
  */

  openFromRecent = (filePath) => {
    const { projectService } = this.props.services;
    const { push } = this.props.history;

    projectService.openProjectFromPath(filePath)
      .then( () => push(DEFAULT_PROJET_ROUTE) );
  }
  
  openProject = () => {
    const { projectService } = this.props.services;
    const { push } = this.props.history;

    projectService.openProject()
      .then( () => push(DEFAULT_PROJET_ROUTE) );
  }
  
  createProject = () => {
    const { projectService } = this.props.services;
    const { push } = this.props.history;

    projectService.createProject()
      .then( () =>  push(DEFAULT_PROJET_ROUTE) );
  }

  renderProjectEntry = (file) => {
    const {fileContent} = this.props.classes;
    return (
      <Paper className={fileContent} key={file} onClick={ () => this.openFromRecent(file) }>
        <Typography variant="subtitle1">{file}</Typography>
      </Paper>
    )
  }

  render() {
    const { home, header, button } = this.props.classes;
    const projects = this.props.app.recentFiles.reverse();

    return (
      <div className={home}>
        <div className={header}>
          <Typography variant="h4">Projects</Typography>
          <div>
            <Button className={button} onClick={this.createProject} variant="contained" color="primary" >
              Nouveau
            </Button>
            <Button className={button} onClick={this.openProject} variant="contained">
              Ouvrir
            </Button>
          </div>
        </div>
        { projects.map(this.renderProjectEntry) }    
      </div>
    );
  }
}

const styles = (theme) => ({
  home: {
    height: "100%",
    position: "relative",
    padding: 20,
    minWidth: '50%'
  },
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  button: {
    marginLeft: 10
  },
  fileContent: {
    padding: "10px",
    marginBottom: "5px",
    width: "100%",
    cursor: "pointer",

    '&:hover' : {
      backgroundColor: 'rgba(0, 0, 0, 0.1)'
    }
  },
});

const mapStateToProps = (state) => ({
  app: state.app
});

export default connect(
  mapStateToProps,
  {}
)(withServices(withStyles(styles)(withRouter(Home))));
