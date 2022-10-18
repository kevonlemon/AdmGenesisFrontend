import { useState, useEffect } from 'react';
import { Grid, Modal, Fade, Button, Box } from '@mui/material';
import PropTypes from 'prop-types';
import succes from '../../assets/images/mensajes/succes.png';
import error from '../../assets/images/mensajes/error.png';
import warning from '../../assets/images/mensajes/warning.png';
import Image from '../Image';

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

export default function MensajesGenericos(props) {
  //   const [openModal, setopenModal] = useState(false);
  //   const toggl
  const [mensaje, setmensaje] = useState('');
  const {
    openModal, // Con esto abrimos los Modales
    closeModal, // Con esto cerramos los Modales
    mantenimmiento, // Con esto se activa si es un mantenimiento
    codigo, // Este es el Codigo que aparece en el modal
    nombre, // Este es el nombre que aparece en el modal
    modomantenimiento, // Aqui se le especifica si el mantenimento el cual presenta el mensaje Edita o Graba
    texto, // Este es el texto si quieres enviar un mensaje personalizado solo texto
    tipo, // Aqui se escoge la clase de mensaje existente succes = correcto, warning = advertencia, error = Que es un error
  } = props;
  //   const img1 = succes.src;
  //   const img2 = error.src;
  //   const img3 = warning.src;

  const mensajesim = [
    { value: 'error', img: error },
    { value: 'warning', img: warning },
    { value: 'succes', img: succes },
  ];

  useEffect(() => {
    setmensaje(texto);
    if (mantenimmiento) {
      setmensaje(`Se registró ${nombre} ${codigo}`);
      if (modomantenimiento === 'Editar') {
        setmensaje(`Se modificó ${nombre} ${codigo}`);
      }
    }
  }, [codigo, nombre, mantenimmiento, modomantenimiento, texto]);

  const filtrado = mensajesim.filter((f) => f.value === tipo)[0].img;

  return (
    <>
      <Modal open={openModal} onClose={closeModal} aria-describedby="modal-modal-description" closeAfterTransition>
        <Fade in={openModal}>
          <Box sx={stylemodal}>
            <Grid container item alignItems="center">
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <Image src={filtrado} />
                {/* <Image src={filtrado[0].img} /> */}
              </Grid>
            </Grid>
            <Grid container item alignItems="center" sx={{ mb: 2 }}>
              <Grid item md={12} sm={12} xs={12}>
                <h3>{modomantenimiento ? mensaje : texto}</h3>
              </Grid>
            </Grid>
            <Grid container item justifyContent="center" sx={{ mb: 2 }}>
              <Grid item md={5} sm={2} xs={6}>
                <Button fullWidth variant="contained" onClick={() => closeModal()}>
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

MensajesGenericos.propTypes = {
  openModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  mantenimmiento: PropTypes.bool,
  codigo: PropTypes.string,
  nombre: PropTypes.string,
  modomantenimiento: PropTypes.string,
  texto: PropTypes.string,
  tipo: PropTypes.string.isRequired,
};
