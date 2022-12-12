import { TextField } from '@mui/material';
import { styled } from '@mui/system';

const RequiredTextField = styled(TextField)(() => ({
    ".MuiFormLabel-root": {   
        '-webkitTextFillColor': "#bb1f30"        
    }
}));

export default RequiredTextField;

