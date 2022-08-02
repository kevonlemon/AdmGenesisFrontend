import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Grid, Modal, Fade, Button } from '@mui/material';
import axios from 'axios';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { CORS, URLAPIGENERAL } from '../../../../../config';

const stylemodal = {
  borderRadius: '1rem',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '90%', md: '90%', lg: '45%' },
  height: 'auto',
  padding: '50px',
  bgcolor: 'background.paper',
  boxShadow: 24,
};

ModalGenericoDelete.propTypes = {
  modulo: PropTypes.string.isRequired,
  nombre: PropTypes.string.isRequired,
  codigo: PropTypes.string.isRequired,
  openModal: PropTypes.bool.isRequired,
  parentCallback: PropTypes.func.isRequired,
  mensaje: PropTypes.func.isRequired,
  urldelelte: PropTypes.string.isRequired,
  urlredirect: PropTypes.string.isRequired,
  datos: PropTypes.object.isRequired,
};

export default function ModalGenericoDelete(props) {
  const { openModal, toggleShow, urldelelte, datos, urlredirect } = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { enqueueSnackbar } = useSnackbar();

  const messajeTool = (variant, msg) => {
    enqueueSnackbar(msg, {
      variant,
      anchorOrigin: { vertical: 'top', horizontal: 'center' },
      autoHideDuration: 3000,
    });
  };

  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [Eliminar, setAceptareliminacion] = useState(true);

  const onTrigger = (event) => {
    const motivotrue = emiMotivo.length;
    if (motivotrue === 0) {
      messajeTool('error', 'Debe colocar un motivo.');
      setError(true);
      return false;
    }
    if (motivotrue < 5) {
      messajeTool('error', 'El Motivo debe tener al menos 5 caracteres.');
      setError(true);
      return false;
    }
    if (motivotrue >= 5) {
      props.parentCallback(event);
    }

    if (Eliminar === true) {
      const GrabarAudinv = async () => {
       
        try {
          await axios.post(`${URLAPIGENERAL}/${urldelelte}`, datos, CORS);
          messajeTool('success', 'Registro eliminado con exito!!!');
          navigate(`${urlredirect}`); 
        } catch (error) {
          messajeTool('error', 'Error al Eliminar del servidor');
        }
      };
      GrabarAudinv();
    }

    return true;
  };

  const [emiMotivo, setMotivo] = useState('');
  const textmotivo = (e) => {
    props.mensaje(e.target.value.toUpperCase());
    setMotivo(e.target.value.toUpperCase());
  };

     // eslint-disable-next-line react-hooks/rules-of-hooks
     const [openModaldelet, setOpenModaldelet1] = useState();
  
     const disparadorcancelar = () => {
    setMotivo('');
    setOpenModaldelet1(toggleShow);
     };
   

  return (
    <Modal
      open={openModal}
      onClose={openModaldelet}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
    >
      <Fade in={openModal}>
        <Box sx={stylemodal}>
          <div style={{ margin: '1rem', fontWeight: 'bold' }}>
            <h2>Motivo de eliminación</h2>
            <h5 style={{ textAlign: 'right' }}>
              {props.modulo} - {props.codigo} - {props.nombre}
            </h5>
          </div>
          <Box ml={2} mr={2}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <TextField
                  id="outlined-multiline-static"
                  label="Motivo de Eliminación"
                  multiline
                  required
                  error={error}
                  fullWidth
                  rows={4}
                  onChange={(e) => textmotivo(e)}
                  value={emiMotivo}
                />
              </Grid>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item md={5} sm={2} xs={6}>
                    <Button fullWidth variant="text" onClick={(e) => onTrigger(e)}>
                      Confirmar
                    </Button>
                  </Grid>
                  <Grid item md={5} sm={2} xs={6}>
                    <Button fullWidth variant="text" onClick={(e) => disparadorcancelar(e)} >
                      Cancelar
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
