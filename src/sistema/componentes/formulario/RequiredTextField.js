import { TextField } from '@mui/material';
import { styled } from '@mui/system';

const RequiredTextField = styled(TextField)(({theme}) => ({
    ".MuiFormLabel-root": {   
        'WebkitTextFillColor': "#bb1f30"        
    },
    ".MuiOutlinedInput-input":{
        "textTransform" : "uppercase" 
    }
}));

export default RequiredTextField;