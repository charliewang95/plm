import React from 'react';
import Button from 'material-ui/Button';
import EditIcon from 'material-ui-icons/Edit';
import Tooltip from 'material-ui/Tooltip';
import {Link} from 'react-router-dom';

/* This class returns a button with Edit Icon. It is linked to EditStorageForm */
const styles = theme => ({
  fab: {
    margin: theme.spacing.unit * 2,
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
  },
});

const EditStorageCapacityButton=()=>{
  return(
    <Tooltip title="Add Vendor">
      <Link to = "/editStorageCapacityForm">
        <Button fab color="secondary">
          <AddIcon />
        </Button>
      </Link>
    </Tooltip>
  );
}

export EditStorageCapacityButton;
