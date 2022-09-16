import { Grid, TextField, MenuItem } from '@mui/material';
import * as React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { URLAPIGENERAL } from '../../../../../config';
import RequiredTextField from '../../../../../sistema/componentes/formulario/RequiredTextField';

export default function MotivoCredito(props) {
  const { codigo } = props;
  const [opcionesmonto, setopcionesmonto] = useState('');
  const [listaropcionesmonto, setlistaropcionesmonto] = useState([]);
  const [porcentaje, setporcentaje] = useState(0);
  useEffect(() => {
    const ObtenerDatos = async () => {
      try {
        const { data } = await axios(`${URLAPIGENERAL}/listarmotivoportipo/listar?Tipo=${codigo}`);
        setlistaropcionesmonto(data);
        setporcentaje(data[0].porcentaje);
        setopcionesmonto(data[0].codigo);
        // console.log(data[0].porcentaje);

        // console.log('Vamos bien', data[0].codigo);
      } catch {
        console.log('Caimos en la Mirian');
      }
    };

    ObtenerDatos();
  }, [codigo]);
  useEffect(() => {
    const EnviarPorsentaje = (event) => {
      props.onPorcentaje(event);
    };
    EnviarPorsentaje(porcentaje);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [porcentaje]);

  return (
    <>
      <Grid item md={12} sm={12} xs={12}>
        <RequiredTextField
          select
          label="Motivo Credito"
          fullWidth
          size="small"
          value={opcionesmonto}
          onChange={(e) => {
            setopcionesmonto(e.target.value);
            const por = listaropcionesmonto.filter((porcentaje) => porcentaje.codigo === e.target.value);
            setporcentaje(por[0].porcentaje);
          }}
        >
          {listaropcionesmonto.map((f) => (
            <MenuItem key={f.codigo} value={f.codigo}>
              {f.nombre}
            </MenuItem>
          ))}
        </RequiredTextField>
      </Grid>
    </>
  );
}
MotivoCredito.propTypes = {
  codigo: PropTypes.string,
  onPorcentaje: PropTypes.func,
};
