import { memo } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';


MenuMantenimiento.propTypes = {
    titulo: PropTypes.string.isRequired
};

function MenuMantenimiento(props) {
    // eslint-disable-next-line react/prop-types
    const { titulo, children  } = props;
    return (
        <Grid container spacing={1} justifyContent="space-between">
            <Grid item md={6} sm={6} xs={12}>
                <Typography variant="h4">{titulo}</Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={12} container spacing={1} justifyContent="flex-end">
                {children}
            </Grid>
        </Grid>
    );
}

export default memo(MenuMantenimiento);
