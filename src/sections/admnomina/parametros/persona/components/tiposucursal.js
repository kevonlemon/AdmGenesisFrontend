import { useState, useEffect } from 'react';
import * as React from 'react';
import axios from 'axios';
import { TextField, MenuItem, Grid } from '@mui/material';
import { URLAPIGENERAL } from '../../../../../config';

// const serverapi = process.env.REACT_APP_SERVERAPI2; // SERVICIO
// OPCIONES ACTIVADAS/ANULADAS/TODAS

// MOTIVO DE DEV
export default function TipoSucursal(props) {
  const [tiposucursal, setTipoSucursal] = React.useState('');
  const [listartipoper, setListarTipoSuc] = React.useState([]);
  const obtenerTipoSucursal = async () => {
    try {
      const { data } = await axios(`${URLAPIGENERAL}/sucursales/listar`);
      setListarTipoSuc(data);
      setTipoSucursal(data[0].codigo);
    } catch {
        setListarTipoSuc([{ codigo: '', nombre: '' }]);
    }
  };
  // CAMBIAR VALOR
  // eslint-disable-next-line react/prop-types
  props.data.tipoper = tiposucursal;
  // console.log("mira",props);
  React.useEffect(() => {
    obtenerTipoSucursal();
  }, []);
  return (
    <TextField
      select
      label="Sucursales"
      value={tiposucursal}
      onChange={(e) => {
        setTipoSucursal(e.target.value);
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
