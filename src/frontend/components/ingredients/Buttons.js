import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import CancelIcon from 'material-ui-icons/Cancel';
import AddIcon from 'material-ui-icons/Add';
import Tooltip from 'material-ui/Tooltip';
import {Link} from 'react-router-dom';

const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Edit row">
    <EditIcon />
  </IconButton>
);
EditButton.propTypes = {
  onExecute: PropTypes.func.isRequired,
};

const DeleteButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Delete row">
    <DeleteIcon />
  </IconButton>
);
DeleteButton.propTypes = {
  onExecute: PropTypes.func.isRequired,
};
const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: 'center' }}>
    <Button
      color="primary"
      onClick={onExecute}
      title="Create new row"
    >
      New
    </Button>
  </div>
);
AddButton.propTypes = {
  onExecute: PropTypes.func.isRequired,
};

export  {EditButton,DeleteButton,AddButton};
