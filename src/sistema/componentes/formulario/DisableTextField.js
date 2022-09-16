import { TextField } from '@mui/material';
import { styled } from '@mui/system';

const DisableTextField = styled(TextField)(() => ({
    ".MuiInputBase-input.Mui-disabled": {
        backgroundColor: "#e5e8eb",
        border: "none",
        borderRadius: '10px',
        'WebkitTextFillColor': "#212B36"
    }
}));

export default DisableTextField;