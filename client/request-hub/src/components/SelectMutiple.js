import React from 'react';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

function MultiSelectExample() {
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    setPersonName(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-multiple-name-label">Name</InputLabel>
      <Select
        labelId="demo-multiple-name-label"
        multiple
        value={personName}
        onChange={handleChange}
        renderValue={(selected) => selected.join(', ')}
      >
        {['Olivia', 'Amelia', 'Isla'].map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
export default SelectMultiple;
