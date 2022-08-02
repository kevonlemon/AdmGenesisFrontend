import { useState, useEffect } from 'react';
import * as React from 'react';
import axios from 'axios';
import { TextField, MenuItem, Grid } from '@mui/material';
import { URLAPIGENERAL } from '../../../../../config';

// const serverapi = process.env.REACT_APP_SERVERAPI2; // SERVICIO
// OPCIONES ACTIVADAS/ANULADAS/TODAS

// MOTIVO DE DEV
export default function TipoPersona(props) {
  const usuario = JSON.parse(window.localStorage.getItem('usuario'));
  const config = {
    headers: {
      'Authorization': `Bearer ${usuario.token}`
    }
  }
  const [tipopersona, setTipoPersona] = React.useState('');
  const [listartipoper, setListarTipoPer] = React.useState([]);
  const obtenerTipoPersona = async () => {
    try {
      const { data } = await axios(`${URLAPIGENERAL}/tipopersonas/listar`,config);
      setListarTipoPer(data);
      setTipoPersona(data[0].codigo);
    } catch {
        setListarTipoPer([{ codigo: '--', nombre: '----' }]);
    }
  };
  // CAMBIAR VALOR
  // eslint-disable-next-line react/prop-types
  props.data.tipo_persona = tipopersona;
  // console.log("mira",props);
  React.useEffect(() => {
    obtenerTipoPersona();
  }, []);
  return (
    <TextField
      select
      label="Tipo"
      value={tipopersona}
      onChange={(e) => {
        setTipoPersona(e.target.value);
      }}
      fullWidth
      size="small"
    >
      {listartipoper.map((t) => (
        <MenuItem key={t.codigo} value={t.codigo}>
          {' '}
          {t.nombre}
        </MenuItem>
      ))}
    </TextField>
  );
}
