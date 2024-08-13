import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

const Root = styled(Box)(({ theme }) => ({
    width: 200,
    marginRight: 5,
    marginLeft: 5,
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
        <Root className="ml-2 mr-2">
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
