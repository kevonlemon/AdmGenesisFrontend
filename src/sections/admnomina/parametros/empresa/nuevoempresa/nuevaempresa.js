import * as React from 'react';
import { Button, Grid, TextField, Box, Card, MenuItem, Fade } from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import { useSnackbar } from 'notistack';
import Page from '../../../../../components/Page';

export default function addEmpresa() {
  // eslint-disable-next-line no-unused-vars
  const [representante, setRpr] =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useState('10');
  // eslint-disable-next-line no-unused-vars
  const [contador, setcontador] =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useState('');
  // eslint-disable-next-line no-unused-vars
  const [giroNegocio, setgiroNegocio] =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useState('');

  const handleChange1 = (event) => {
    setRpr(event.target.value);
  };

  const handleChange2 = (event) => {
    setcontador(event.target.value);
  };

  const handleChange3 = (event) => {
    setgiroNegocio(event.target.value);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    enqueueSnackbar('Revisar que la credencial sea la correcta', {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
    });
  };

  


  return (
    <>
      <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
        <Page title="Nueva Empresa">
          <Box sx={{ ml: 3, mr: 3, p: 0 }}>
            <Grid container spacing={1} justifyContent="flex-end">
              <Grid item md={2} sm={2} xs={6}>
                <Button
                fullWidth
                variant="contained"
                // onClick={() => limpiar()}
                startIcon={<InsertDriveFileRoundedIcon />}>
                  Nuevo
                </Button>
              </Grid>
              <Grid item md={2} sm={2} xs={6}>
                <Button fullWidth variant="contained" startIcon={<SaveRoundedIcon />} onClick={handleClick}>
                  Grabar
                </Button>
              </Grid>
              <Grid item md={2} sm={2} xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  // component={RouterLink}
                  // to={PATH_DASHBOARD.admempresa}
                  startIcon={<ArrowCircleLeftRoundedIcon />}
                >
                  Volver
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ ml: 3, mr: 3, p: 1 }} style={{ fontWeight: '400px' }}>
            <h1>Nueva Empresa</h1>
          </Box>
          <Card sx={{ ml: 3, mr: 3, mb: 2, p: 1 }}>
            <Box sx={{ width: '100%', p: 2 }}>
              <Grid container>
                <Grid item container spacing={1} md={6}>
                  <Grid item sm={3} xs={12} md={3}>
                    <TextField fullWidth label="Código" value="CE-001" id="outlined-size-small" size="small"

                     />
                  </Grid>
                  <Grid item sm={6} xs={12} md={9}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      value="Javier Caicedo Delgado"
                      id="outlined-size-small"
                      size="small"
                    />
                  </Grid>
                  <Grid item sm={6} xs={12} md={4}>
                    <TextField fullWidth label="Ruc"  id="outlined-size-small" size="small" />
                  </Grid>
                  <Grid item sm={6} xs={12} md={4}>
                    <TextField fullWidth label="Teléfono"  id="outlined-size-small" size="small" />
                  </Grid>
                  <Grid item sm={6} xs={12} md={4}>
                    <TextField fullWidth label="Celular"  id="outlined-size-small" size="small" />
                  </Grid>
                  <Grid item sm={6} xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Correo Electrónico"

                      id="outlined-size-small"
                      size="small"
                    />
                  </Grid>
                  <Grid item sm={6} xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={representante}
                      // defaultValue={10}
                      label="Representante"
                      onChange={handleChange1}
                    >
                      <MenuItem value="Ninguno">Ninguno</MenuItem>
                      <MenuItem value={10}>Ing. Jose</MenuItem>
                      <MenuItem value={20}>Ing. Andres</MenuItem>
                      <MenuItem value={30}>Ing. Maria</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item sm={6} xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      // value={contador}
                      value={10}
                      label="Contador"
                      onChange={handleChange2}
                    >
                      <MenuItem value="Ninguno">Ninguno</MenuItem>
                      <MenuItem value={10}>Lcdo. Luis</MenuItem>
                      <MenuItem value={20}>Lcda. Mabel</MenuItem>
                      <MenuItem value={30}>Lcda. Helen</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item sm={6} xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      //  value={giroNegocio}
                      value={10}
                      label="Giro_Negocio"
                      onChange={handleChange3}
                    >
                      <MenuItem value="Ninguno">Ninguno</MenuItem>
                      <MenuItem value={10}>Industrial</MenuItem>
                      <MenuItem value={20}>Comercial</MenuItem>
                      <MenuItem value={30}>Servicios</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item sm={6} xs={12} md={6}>
                    <TextField select fullWidth size="small" defaultValue={10} label="Versión">
                      <MenuItem value={10}>Enable</MenuItem>
                      <MenuItem value={20}>status 2</MenuItem>
                      <MenuItem value={30}>status 3</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item sm={6} xs={12} md={6}>
                    <TextField fullWidth label="Resolución" value="REF-021011" id="outlined-size-small" size="small" />
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Page>
      </Fade>
    </>
  );
}
