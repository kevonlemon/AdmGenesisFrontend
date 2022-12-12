import es from 'date-fns/locale/es';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

DateTextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
};

function DateTextField(props) {
  const { label, value, onChange, disabled, sx } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
      <DesktopDatePicker
        label={label}
        inputFormat="dd/MM/yyyy"
        value={value}
        onChange={(e) => {
          onChange(e);
        }}
        disabled={disabled}
        renderInput={(params) => <TextField {...params} fullWidth size="small" />}
        {...sx}
      />
    </LocalizationProvider>
  );
}

export default DateTextField;
