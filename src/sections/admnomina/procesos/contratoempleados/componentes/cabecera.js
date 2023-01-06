// @KF-14/12/2022
import * as React from 'react';
import { Grid, Button, Fade } from '@mui/material';
import Box from '@mui/material/Box';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { ContratoEmpleadosContext } from '../contextos/contratoEmpleadosContext';

export default function Cabecera() {
  const { formularioFinal, enviarArchivos } = React.useContext(ContratoEmpleadosContext);

  const Guardar = () => {
    enviarArchivos();
  };

  return (
    <>
      <Page title="Contrato de Empleados">
        {/* CABECERA */}
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Box sx={{ ml: 3, mr: 3, p: 1 }}>
            <HeaderBreadcrumbs
              heading="Contrato de Empleados"
              links={[{ name: 'Inicio' }, { name: 'Procesos' }, { name: 'Contrato de Empleados' }]}
              action={
                <Grid container spacing={1}>
                  {/* BOTON NUEVO */}
                  <Grid item md={4} sm={4} xs={12}>
                    <Button fullWidth variant="text" size="medium" startIcon={<SaveRoundedIcon />} onClick={Guardar}>
                      Guardar
                    </Button>
                  </Grid>
                </Grid>
              }
            />
          </Box>
        </Fade>
      </Page>
    </>
  );
}
