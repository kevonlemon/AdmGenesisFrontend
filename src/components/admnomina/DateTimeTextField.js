import es from 'date-fns/locale/es';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

DateTimeTextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  sx: PropTypes.object,
};

function DateTimeTextField(props) {
  const { label, value, onChange, disabled, sx } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
      <DateTimePicker
        label={label}
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

export default DateTimeTextField;
