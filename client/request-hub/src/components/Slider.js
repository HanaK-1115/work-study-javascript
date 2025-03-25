import React from 'react';
import Slider from '@mui/material/Slider';

function SliderExample() {
  const [value, setValue] = React.useState(30);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Slider value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
  );
}

export default Slider;