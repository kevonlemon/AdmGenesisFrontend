import { memo } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Grid, Chip, Typography } from '@mui/material';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import { fCurrency } from '../../utils/formatNumber'

TarjetaInforme.propTypes = {
    titulo: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    valor: PropTypes.number.isRequired,
}

function TarjetaInforme(props) {
    const { titulo, color, valor } = props;
    return (
        <Card variant="outlined">
            <CardContent sx={{ p: 0, m: 0 }}>
                <Grid container justifyContent="flex-end">
                    <Grid item xs={10}>
                        <Chip label={titulo} color={color} sx={{ color: 'white' }} />
                    </Grid>
                    <Grid item xs={2} fontSize="1rem">
                        <PaidOutlinedIcon />
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h6">{fCurrency(valor)}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default memo(TarjetaInforme);
