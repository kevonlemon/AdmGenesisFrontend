import { Grid, TextField, MenuItem } from '@mui/material';
import * as React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { URLAPIGENERAL } from '../../../../../config';

export default function TipoCredito(props) {
  const { tipo } = props;
  const [tipocredito, settipocredito] = useState('');
  const [listartipocredito, setlisartipocredito] = useState([]);

  // eslint-disable-next-line react/prop-types
  //  props.data.tipo = settipo();
  // console.log('Eltipo', tipo);
  // eslint-disable-next-line react/prop-types
  props.data.tipocreditos = tipocredito;

  useEffect(() => {
    const ObtenerDatos = async () => {
      try {
        const { data } = await axios(`${URLAPIGENERAL}/listarportipocredito/listar?Tipo=${tipo}`);
        setlisartipocredito(data);
        settipocredito(data[0].codigo);

        // console.log('Aparentemente esta todo bien  ', data);
      } catch {
        console.log('Caimos en el error');
      }
    };

    ObtenerDatos();

    // console.log(tipocredito);
  }, [tipo]);

  // Tratando de enviar al padre el valor
  useEffect(() => {
    const onDato = (event) => {
      props.onValor(event);
    };
    onDato(tipocredito);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipocredito]);
  return (
    <>
      <Grid item md={12} sm={12} xs={12}>
        <TextField
          select
          label="Tipo Credito"
          fullWidth
          size="small"
          value={tipocredito}
          onChange={(e) => settipocredito(e.target.value)}
        >
          {listartipocredito.map((f) => (
            <MenuItem key={f.codigo} value={f.codigo}>
              {f.nombre}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </>
  );
}
TipoCredito.propTypes = {
  tipo: PropTypes.string.isRequired,
  onValor: PropTypes.func.isRequired,
};
