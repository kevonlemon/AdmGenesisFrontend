// @KF-14/12/2022
import * as React from 'react';
import { Grid, Card, TextField, Fade, MenuItem } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker, DesktopTimePicker } from '@mui/x-date-pickers';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import es from 'date-fns/locale/es';
import { NumericFormat } from 'react-number-format';
import { useContext } from 'react';

import { UploadMultiFile } from '../../../../../components/upload';
import CajaGenerica from '../../../../../components/admnomina/CajaGenerica';
import RequiredTextField from '../../../../../sistema/componentes/formulario/RequiredTextField';
import { getEmpleados, getTipoContrato } from '../servicios/getData';
import { ContratoEmpleadosContext } from '../contextos/contratoEmpleadosContext';

export default function Formulario() {
  const {
    fterminacionRef,
    hfinRef,
    sufijo,
    empleadoRef,
    archivo,
    removerTodosLosArchivos,
    removerArchivo,
    cargarArchivos,
    listaEmpleados,
    listacontratos,
    empleados,
    formulario,
    dias,
    SetearEmpleados1,
    SetearEmpleados2,
    SetearEmpleados3,
    SetearContatos,
    SetearContratoFormulario,
    SetearDiaInicio,
    SetearDiaFin,
    SetearHoraInicio,
    SetearHoraFin,
    SetearFechaContrato,
    SetearFechaIngreso,
    SetearFechaTerminacion,
    SetearObservacion,
    SetearPeriodoDescanso,
  } = useContext(ContratoEmpleadosContext);

  React.useEffect(() => {
    const dataEmpleados = getEmpleados();
    dataEmpleados().then((data) => {
      SetearEmpleados1(data);
    });

    const dataContratos = getTipoContrato();
    dataContratos().then((data) => {
      SetearContatos(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* FORMULARIO */}
      <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
        <Card sx={{ ml: 3, mr: 3, p: 2 }}>
          <Grid container item xs={12} spacing={1}>
            <Grid container item md={6} spacing={1} sm={6} xs={12}>
              {/* EMPLEADOS */}
              <Grid item md={12} sm={12} xs={12} mb={1}>
                <CajaGenerica
                  inputRef={empleadoRef}
                  activarDependencia
                  ejecutarDependencia={(e) => {
                    SetearEmpleados3(e);
                  }}
                  estadoInicial={{
                    codigoAlternativo: empleados.codigoalternativo,
                    nombre: empleados.nombre,
                  }}
                  tituloTexto={{ nombre: 'Empleado', descripcion: 'Nombre Empleado' }}
                  tituloModal={'Empleados'}
                  retornarDatos={(e) => {
                    SetearEmpleados2(e);
                  }}
                  datos={listaEmpleados}
                />
              </Grid>
            </Grid>
            <Grid container item md={6} spacing={1} sm={6} xs={12}>
              {/* CONTRATOS */}
              <Grid item md={12} sm={12} xs={12} mb={1}>
                <RequiredTextField
                  select
                  required
                  size={'small'}
                  label={'Tipo de contrato'}
                  value={formulario.codcontrato}
                  fullWidth
                  onChange={(e) => {
                    SetearContratoFormulario(e.target.value);
                  }}
                >
                  {listacontratos.map((option) => (
                    <MenuItem key={option.id} value={option.codigo}>
                      {option.nombre}
                    </MenuItem>
                  ))}
                </RequiredTextField>
              </Grid>
            </Grid>
            <Grid container item md={6} spacing={1} sm={6} xs={12}>
              {/* DIA INICIO */}
              <Grid item md={6} sm={6} xs={6} mb={1}>
                <RequiredTextField
                  select
                  required
                  size={'small'}
                  label={'Día Inicio'}
                  value={formulario.dinicio}
                  fullWidth
                  onChange={(e) => {
                    SetearDiaInicio(e.target.value);
                  }}
                >
                  {dias.map((option) => (
                    <MenuItem key={option.id} value={option.codigo}>
                      {option.dia}
                    </MenuItem>
                  ))}
                </RequiredTextField>
              </Grid>
              {/* DIA FIN */}
              <Grid item md={6} sm={6} xs={6} mb={1}>
                <RequiredTextField
                  select
                  required
                  size={'small'}
                  label={'Día Fin'}
                  value={formulario.dfin}
                  fullWidth
                  onChange={(e) => {
                    SetearDiaFin(e.target.value);
                  }}
                >
                  {dias.map((option) => (
                    <MenuItem key={option.id} value={option.codigo}>
                      {option.dia}
                    </MenuItem>
                  ))}
                </RequiredTextField>
              </Grid>
            </Grid>
            <Grid container item md={6} spacing={1} sm={6} xs={12}>
              {/* HORA INICIO */}
              <Grid item md={6} sm={6} xs={6} mb={1}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                  <DesktopTimePicker
                    label="Hora Inicio"
                    value={formulario.hinicio}
                    onChange={(newValue) => {
                      SetearHoraInicio(newValue);
                    }}
                    renderInput={(params) => <RequiredTextField {...params} fullWidth size="small" />}
                  />
                </LocalizationProvider>
              </Grid>
              {/* HORA FIN */}
              <Grid item md={6} sm={6} xs={6} mb={1}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                  <DesktopTimePicker
                    inputRef={hfinRef}
                    label="Hora Fin"
                    value={formulario.hfin}
                    onChange={(newValue) => {
                      SetearHoraFin(newValue);
                    }}
                    renderInput={(params) => <RequiredTextField {...params} fullWidth size="small" />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Grid container item md={6} spacing={1} sm={6} xs={12}>
              {/* FECHA CONTRATO */}
              <Grid item md={6} sm={6} xs={12} mb={1}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  <DesktopDatePicker
                    label="Fecha Contrato"
                    value={formulario.fcontrato}
                    inputFormat="dd/MM/yyyy"
                    onChange={(newValue) => {
                      SetearFechaContrato(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                  />
                </LocalizationProvider>
              </Grid>
              {/* FECHA INGRESO */}
              <Grid item md={6} sm={6} xs={12} mb={1}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  <DesktopDatePicker
                    label="Fecha Ingreso"
                    value={formulario.fingreso}
                    inputFormat="dd/MM/yyyy"
                    onChange={(newValue) => {
                      SetearFechaIngreso(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                  />
                </LocalizationProvider>
              </Grid>
              {/* PERIODO DE DESCANSO */}
              <Grid item md={6} sm={6} xs={6} mb={1}>
                <NumericFormat
                  customInput={TextField}
                  fullWidth
                  size="small"
                  type="text"
                  suffix={sufijo()}
                  decimalScale={2}
                  thousandSeparator
                  label="Periodo de descanso"
                  variant="outlined"
                  value={formulario.periododescanso}
                  onValueChange={(value) => SetearPeriodoDescanso(value)}
                />
              </Grid>
              {/* FECHA TERMINACION */}
              <Grid item md={6} sm={6} xs={12} mb={1}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  <DesktopDatePicker
                    inputRef={fterminacionRef}
                    label="Fecha Terminacion"
                    value={formulario.fterminacion}
                    inputFormat="dd/MM/yyyy"
                    onChange={(newValue) => {
                      SetearFechaTerminacion(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Grid container item md={6} spacing={1} sm={6} xs={12}>
              {/* OBSERVACION */}
              <Grid item md={12} sm={12} xs={12} mb={1}>
                <TextField
                  multiline
                  rows={4}
                  size="normal"
                  fullWidth
                  label="Observación"
                  value={formulario.observacion}
                  onChange={(e) => {
                    SetearObservacion(e.target.value);
                  }}
                />
              </Grid>
            </Grid>
            <Grid container item md={12} spacing={1} sm={12} xs={12}>
              {/* SUBIDA DE ARCHIVOS */}
              <Grid item xs={12}>
                <UploadMultiFile
                  multiple
                  files={archivo}
                  onDrop={cargarArchivos}
                  onRemove={removerArchivo}
                  onRemoveAll={removerTodosLosArchivos}
                />
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Fade>
    </>
  );
}
