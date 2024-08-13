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
        height: 4,        // Height of the slider track
        padding: '13px 0',
    },
    '& .MuiSlider-thumb': {
        width: 16,
        height: 16,
        backgroundColor: '#493db8', // Thumb color
        '&:hover': {
            boxShadow: '0 0 0 8px #7d47e922', // Shadow effect on hover
        },
        '&.Mui-active': {
            boxShadow: '0 0 0 14px #7d47e922', // Shadow effect when active
        },
    },
    '& .MuiSlider-track': {
        height: 4,
        backgroundColor: '#7d47e9',
        border: 'none',
        borderRadius: 4, // Rounded corners for the track
    },
    '& .MuiSlider-rail': {
        height: 4,
        borderRadius: 4, // Rounded corners for the rail
        backgroundColor: '#afa3e2',
    },
    '& .MuiSlider-valueLabel': {
        backgroundColor: '#4c38a6',
        opacity: 0.8
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
