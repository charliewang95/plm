import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, CardText } from 'material-ui/Card';
//import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class Login extends React.Component {

  constructor(props) {
    super(props)

  }

  render() {
//    const {
//          onSubmit,
//          onChange,
//          errors,
//          successMessage,
//          user,
//          toggleAuthenticateStatus
//    } = this.state;
//
//    this.propTypes = {
//      onSubmit: PropTypes.func.isRequired,
//      onChange: PropTypes.func.isRequired,
//      errors: PropTypes.object.isRequired,
//      successMessage: PropTypes.string.isRequired,
//      user: PropTypes.object.isRequired
//    };

    return (
      <Card className="container">
          <form>
            <h2 className="card-heading">Login</h2>

            <div className="field-line">
              <TextField
                floatingLabelText="Email"
              />
            </div>

            <div className="field-line">
              <TextField
                floatingLabelText="Password"
              />
            </div>

            //<CardText>Don't have an account?</CardText>
          </form>
        </Card>
    );
  }
}

export default Login