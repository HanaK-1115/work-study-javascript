import React from 'react';
import TextField from '@mui/material/TextField';

function TextAreaExample() {
  return (
    <TextField
      label="Description"
      multiline
      rows={4}
      defaultValue="Default Value"
      variant="outlined"
    />
  );
}

export default TextBox;