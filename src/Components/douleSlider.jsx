import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

const Root = styled(Box)(({ theme }) => ({
  width: 200,
}));

const CSlider = styled(Slider)(({ theme }) => ({
  root: {
    height: 3,
    padding: '13px 0',
  },
  '& .MuiSlider-track': {
    height: 4,
    borderRadius: 2,
  },
  '& .MuiSlider-thumb': {
    backgroundColor: '#fff',
  },
}));

function valuetext(value) {
  return `${value}`;
}

export default function RangeSlider(props) {
  const [value, setValue] = React.useState([20, 40]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCommit = (event, newValue) => {
    console.log(newValue);
  };

  return (
    <Root>
      <Typography id="range-slider" gutterBottom>
        Value range
      </Typography>
      <CSlider
        disabled={props.isDisabled}
        value={value}
        onChange={handleChange}
        onChangeCommitted={handleCommit}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
    </Root>
  );
}
