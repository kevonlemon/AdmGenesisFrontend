import * as React from 'react';
import { Grid, Card, Button, FormControlLabel, Checkbox, Typography, MenuItem, Container } from '@mui/material';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import axios from 'axios';

import CajaGenerica from '../../../../components/cajagenerica';
import Page from '../../../../components/Page';
import useSettings from '../../../../hooks/useSettings';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import RequiredTextField from '../../../../sistema/componentes/formulario/RequiredTextField';
import { getEmpleados } from './servicios/getData';
import { URLAPIGENERAL } from '../../../../config';

export default function ContratoEmpleado() {
  const { themeStretch } = useSettings();
  const [formulario, setFormulario] = React.useState({
    empleado: '',
    tipoContrato: '',
  });
  const [listaEmpleados, setListaEmpleados] = React.useState([]);
  const [empleados, setEmpleados] = React.useState({
    nombre: '',
    codigo: '',
    codigoalternativo: '',
  });
  const MostrarItem = [
    {
      id: 1,
      codigo: 'factura',
      nombre: 'Factura',
    },
    {
      id: 2,
      codigo: 'ncr',
      nombre: 'Nota de Credito',
    },
    {
      id: 3,
      codigo: 'nvt',
      nombre: 'Nota de Venta',
    },
  ];
  const user = JSON.parse(window.localStorage.getItem('usuario'));
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  React.useEffect(() => {
    // const dataEmpleados = getEmpleados();
    // console.log(dataEmpleados);
    // setListaEmpleados(dataEmpleados);
    // setEmpleados({
    //   nombre: dataEmpleados[0].nombre,
    //   codigo: dataEmpleados[0].codigo,
    //   codigoalternativo: dataEmpleados[0].codigoalternativo,
    // });
  }, []);

  return (
    <>
      <Page title="Contrato de Empleados">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Contrato de Empleados"
            links={[{ name: 'Inicio' }, { name: 'Procesos' }, { name: 'Contrato de Empleados' }]}
          />
        </Container>
      </Page>
      <div>
        {/* Botones */}
        <Grid container spacing={1} mb={2} justifyContent="flex-end">
          {/* BOTON IMPRIMIR */}
          <Grid item md={2} sm={4} xs={6}>
            <Button
              fullWidth
              variant="text"
              target="_blank"
              startIcon={<PictureAsPdfRoundedIcon />}
              //   href={PDFlink}
            >
              Imprimir
            </Button>
          </Grid>
          {/* BOTON NUEVO */}
          <Grid item md={2} sm={4} xs={6}>
            <Button fullWidth variant="text" size="medium" startIcon={<InsertDriveFileRoundedIcon />}>
              Nuevo
            </Button>
          </Grid>
        </Grid>
        <Card sx={{ width: '100%', p: 2, pt: 3 }}>
          <Grid container item xs={12} spacing={1} mb={2}>
            {/* BOTONES */}
            <Grid item md={6} sm={6} xs={12}>
              <RequiredTextField
                select
                required
                size={'small'}
                label={'Documentos'}
                value={''}
                fullWidth
                onChange={(e) => {
                  setFormulario({
                    ...formulario,
                    documento: e.target.value,
                    // tipo: SeleccionTipo(e.target.value),
                  });
                  //   setControles(ControladorCajas(e.target.value));
                }}
              >
                {MostrarItem.map((option) => (
                  <MenuItem key={option.id} value={option.codigo}>
                    {option.nombre}
                  </MenuItem>
                ))}
              </RequiredTextField>
            </Grid>
            <Grid container item md={6} spacing={1} sm={12} xs={12}>
              {/* EMPLEADOS */}
              {/* <Grid item md={12} sm={12} xs={12}>
                <CajaGenerica
                  desactivarBusqueda={empleados.clientes}
                  activarDependencia
                  ejecutarDependencia={(e) => {
                    setEmpleados({
                      codigoalternativo: e.codigoalternativo,
                      nombre: '',
                      codigo: '',
                    });
                  }}
                  estadoInicial={{
                    codigoAlternativo: empleados.codigoalternativo,
                    nombre: empleados.nombre,
                  }}
                  tituloTexto={{ nombre: 'Empleado', descripcion: 'Nombre Empleado' }}
                  tituloModal={'Clientes'}
                  busquedaEnLinea
                  tipobusquedaEnLinea="cliente"
                  retornarDatos={(e) => {
                    setEmpleados({
                      codigoalternativo: e.codigoalternativo,
                      nombre: e.nombre,
                      codigo: e.codigo,
                    });
                  }}
                  datos={listaEmpleados}
                />
              </Grid> */}
            </Grid>
          </Grid>
        </Card>
      </div>
    </>
  );
}
