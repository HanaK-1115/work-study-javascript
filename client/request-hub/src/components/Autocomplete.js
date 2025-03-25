import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function AutocompleteExample() {
  const options = ['Option 1', 'Option 2', 'Option 3'];

  return (
    <Autocomplete
      options={options}
      renderInput={(params) => <TextField {...params} label="Choose an option" variant="outlined" />}
    />
  );
}
