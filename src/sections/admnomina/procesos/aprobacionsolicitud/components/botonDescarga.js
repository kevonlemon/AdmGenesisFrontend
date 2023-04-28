import { Button } from "@mui/material";
import PropTypes from 'prop-types';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

BotonDescarga.propTypes = {
    texto: PropTypes.string,
    accion: PropTypes.func,
}

export default function BotonDescarga(props) {

    const { texto, accion } = props

    return (
        <Button
            onClick={accion}
            endIcon={<DownloadRoundedIcon />}
        >
            {texto}
        </Button>
    )
}