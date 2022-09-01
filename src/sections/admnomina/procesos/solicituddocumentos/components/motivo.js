import { TextField, MenuItem } from '@mui/material';
import * as React from 'react';
import PropTypes from "prop-types";
import axios from 'axios';
import { URLAPIGENERAL } from '../../../../../config';

Motivo.prototype = {
    disparador: PropTypes.func.isRequired,
}

export default function Motivo(props) {

    const usuario = JSON.parse(window.localStorage.getItem('usuario'));
    const config = {
        headers: {
            'Authorization': `Bearer ${usuario.token}`
        }
    }

    const { disparador } = props;
    const [motivo, setMotivo] = React.useState('');
    const [listarMotivo, setListarMotivo] = React.useState([]);

    const ObtenerMotivo = async () => {
        try {
            const { data } = await axios(`${URLAPIGENERAL}/mantenimientogenerico/listarportabla?tabla=NOM_MOTIVO_SOLICITUD`, config);
            setListarMotivo(data);
            setMotivo(data[0].codigo);
        } catch {
            setListarMotivo([{ codigo: '---', nombre: '---' }]);
        }
    };
    // eslint-disable-next-line react/prop-types
    props.data.motivo = motivo;
    React.useEffect(() => {
        ObtenerMotivo();
    }, []);

    return (
        <TextField
            //   disabled={!desactivar}
            select
            label="Motivo"
            value={motivo}
            onChange={(e) => {
                setMotivo(e.target.value);
                disparador(e.target.value);
            }}
            fullWidth
            size="small"
        >
            {listarMotivo.map((f) => (
                <MenuItem key={f.codigo} value={f.codigo}>
                    {f.nombre}
                </MenuItem>
            ))}
        </TextField>
    );
}