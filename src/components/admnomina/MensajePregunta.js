import { memo } from 'react';
import { Grid, Modal, Fade, Button, Box, Typography } from '@mui/material';
import ImagenPregunta from '../../assets/images/mensajes/pregunta.png';
import Image from '../Image';
import useMensajeGeneral from '../../hooks/admnomina/useMensajeGeneral';

const stylemodal = {
  borderRadius: '0.5rem',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '80%', sm: '60%', md: '30%', lg: '20%', xl: '25%' },
  height: 'auto',
  padding: '10px',
  bgcolor: 'background.paper',
  textAlign: 'center',
  boxShadow: 30,
};

function MensajesPregunta() {
  const { abrirModalPregunta, cerrarModalPregunta, mensajePregunta, ejecutarFuncionSi } = useMensajeGeneral();
  return (
    <Modal
      open={abrirModalPregunta}
      onClose={() => {
        cerrarModalPregunta();
      }}
      aria-describedby="modal-modal-description"
      closeAfterTransition
    >
      <Fade in={abrirModalPregunta} >
        <Box sx={stylemodal}>
          <Grid container spacing={1} justifyContent="center" alignItems="center">
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <Image src={ImagenPregunta} />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Typography variant="p">{mensajePregunta}</Typography>
            </Grid>
            <Grid item md={5} sm={6} xs={6}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  ejecutarFuncionSi.funcion();
                  cerrarModalPregunta();
                }}
              >
                Si
              </Button>
            </Grid>
            <Grid item md={5} sm={6} xs={6}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  cerrarModalPregunta();
                }}
              >
                No
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
}

export default memo(MensajesPregunta);
