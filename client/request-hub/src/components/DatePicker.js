import React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

function DateInput({ label, value, onChange }) {  // label プロパティを追加
  return (
    
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}  // DatePickerのラベルを動的に設定
        value={value}
        onChange={onChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}

export default DateInput;
