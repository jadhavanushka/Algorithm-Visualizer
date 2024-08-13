import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

const Root = styled(Box)(({ theme }) => ({
    width: 200,
    marginRight: 10,
    marginLeft: 10,
    marginTop: -60,
    height: 4,        // Height of the slider track
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
    }
}));

function valuetext(value) {
    return `${value}`;
}

export default function DiscreteSlider(props) {
    const handleChange = (event) => {
        if (event.target.innerText === "") {
            return;
        }
        const num = parseInt(event.target.innerText, 10);
        props.onCountChange(num);
    };

    return (
        <Root>
            <Typography id="discrete-slider" gutterBottom>
                {props.title}
            </Typography>
            <Slider
                defaultValue={props.default}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                onChangeCommitted={handleChange}
                step={props.step}
                marks={props.marks}
                min={props.min}
                max={props.max}
                disabled={props.isDisabled}
            />
        </Root>
    );
}
