import { useState, useEffect, memo } from 'react';
import { Grid, Modal, Fade, Button, Box, Typography } from '@mui/material';
import succes from '../../assets/images/mensajes/succes.png';
import error from '../../assets/images/mensajes/error.png';
import warning from '../../assets/images/mensajes/warning.png';
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
const mensajesim = [
  { value: 'error', img: error },
  { value: 'warning', img: warning },
  { value: 'success', img: succes },
];

function MensajesGeneral() {
  const { abrirModalGenerico, cerrarModalGenerico, mensajeGenerico, ejecutarFuncionAceptar } = useMensajeGeneral();
  const [mensajeModal, setMensajeModal] = useState('');

  useEffect(() => {
    if (mensajeGenerico.esMantenimiento) {
      if (mensajeGenerico.tipoMantenimiento === 'editar') setMensajeModal(`Se Modifico a ${mensajeGenerico.mensaje}`);
      if (mensajeGenerico.tipoMantenimiento === 'nuevo') setMensajeModal(`Se registro a ${mensajeGenerico.mensaje}`);
    } else {
      setMensajeModal(mensajeGenerico.mensaje);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mensajeGenerico.mensaje]);

  const filtrado = mensajesim.filter((f) => f.value === mensajeGenerico.tipo);

  return (
    <>
      <Modal
        open={abrirModalGenerico}
        onClose={() => {
          cerrarModalGenerico();
        }}
        aria-describedby="modal-modal-description"
        closeAfterTransition
      >
        <Fade in={abrirModalGenerico}>
          <Box sx={stylemodal}>
            <Grid container spacing={1} justifyContent="center" alignItems="center">
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <Image src={filtrado[0].img} />
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <Typography variant="p">
                  {mensajeGenerico.esMantenimiento ? mensajeModal : mensajeGenerico.mensaje}
                </Typography>
              </Grid>
              <Grid item md={5} sm={2} xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    cerrarModalGenerico();
                    ejecutarFuncionAceptar.funcion();
                  }}
                >
                  Aceptar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default memo(MensajesGeneral);
