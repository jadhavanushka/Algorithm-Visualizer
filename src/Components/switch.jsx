import React from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';

const CustomSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase': {
        color: '#807bb7', // Color of the switch when unchecked
        '&:hover': {
            backgroundColor: '#7d47e922', // Background color when hovering over the thumb
        },
        '&.Mui-checked': {
            color: '#493db8', // Color of the switch when checked
            '&:hover': {
                backgroundColor: '#7d47e922', // Background color when hovering over the thumb when checked
            },
        },
    },
    '& .MuiSwitch-track': {
        backgroundColor: '#cac4e3', // Color of the track when unchecked
        borderRadius: 16, // Rounded corners for the track
        opacity: 1, 
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: '#7d47e9', // Color of the track when checked
    },
}));

const Root = styled(Box)(({ theme }) => ({
    marginRight: 10,
    marginLeft: 10,
}));

export default function SwitchLabels(props) {
    const [state, setState] = React.useState({
        checkedA: false,
    });

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        props.onDoubleChange(event.target.checked);
    };

    return (
        <Root>
            <FormControlLabel
                control={<CustomSwitch checked={state.checkedA} onChange={handleChange} name="checkedA"  />}
                label={props.label}
                disabled={props.isDisabled}
            />
        </Root>
    );
}
