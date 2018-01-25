import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import logo from './grain1.png';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import navBarStyles from './index.css';
import * as labels from './labels.js';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

/* DID NOT WORK - */
// import FileUpload from 'material-ui/svg-icons/file/upload';
import SocialPerson from 'material-ui/svg-icons/social/person';

function handleClick() {
  alert('onClick triggered on the title component');
}

const styles = {
  title: {
    cursor: 'pointer',
    marginTop: 0,
  
  },
};

export default class NavigationBar extends React.Component {

  constructor(props) {
    super(props);
  }



  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    return (
      <AppBar
        showMenuIconButton={false}
        // title = {<span style={styles.title}>{<img src = {logo}/>} Hypothetical Meals </span>}
        title = {<span style={styles.title}>{<img src = {logo}/>} Hypothetical Meals </span>}
        onTitleClick={handleClick}
        onTitleTouchTap={()=> this.context.router.push('/')}
        zDepth={0}
        iconStyleRight={navBarStyles.elementRight}
        iconElementRight={
            <div>
                {/* <Link to="/about" > */}
                    <FlatButton
                        label={labels.IMPORT}
                        labelPosition="before"
                        style={navBarStyles.uploadButton}
                        containerElement="label"
                        // icon = {<FileUpload /> }
                        >
                      <input type="file" style={navBarStyles.uploadInput} />
                    </FlatButton>
                {/* </Link> */}
                {/* <Link to="/posts" > */}
                    <FlatButton
                      label={labels.INGREDIENTS}
                      labelPosition="before"
                      style={navBarStyles.uploadButton}
                      containerElement="label"
                      >
                    </FlatButton>
                {/* </Link> */}
                {/* <Link to="/projects" > */}
                <FlatButton
                  label={labels.REPORTING}
                  labelPosition="before"
                  style={navBarStyles.uploadButton}
                  containerElement="label"
                  >
                </FlatButton>
                {/* </Link> */}
                {/* <Link to="/projects" > */}
                <FlatButton
                  label={labels.STORAGE}
                  labelPosition="before"
                  style={navBarStyles.uploadButton}
                  containerElement="label"
                  >
                </FlatButton>

                <FlatButton
                  label={labels.ACCOUNT}
                  labelPosition="before"
                  style={navBarStyles.uploadButton}
                  containerElement="label"
                  icon = {<SocialPerson /> }
                  >
                </FlatButton>

              {/* </Link> */}
            </div>
            }
      />
    );
  }
}
