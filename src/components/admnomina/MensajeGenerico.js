// import { useState, useEffect, useContext } from 'react';
// import { Grid, Modal, Fade, Button, Box, Typography } from '@mui/material';
// import PropTypes from 'prop-types';
// import succes from '../../assets/images/mensajes/succes.png';
// import error from '../../assets/images/mensajes/error.png';
// import warning from '../../assets/images/mensajes/warning.png';
// import Image from '../Image';
// // import { MensajeGenericoContext } from '../../contexts/admmedico/MensajeContext';


// const stylemodal = {
//   borderRadius: '0.5rem',
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: { xs: '80%', sm: '60%', md: '30%', lg: '20%', xl: '25%' },
//   height: 'auto',
//   padding: '10px',
//   bgcolor: 'background.paper',
//   textAlign: 'center',
//   boxShadow: 30,
// };
// const mensajesim = [
//   { value: 'error', img: error },
//   { value: 'warning', img: warning },
//   { value: 'success', img: succes },
// ];
// // MensajesGenericos.propTypes = {
// //   abrirModal: PropTypes.bool.isRequired, // muestra el mensaje
// //   cerrarModal: PropTypes.func.isRequired, // cierra el mensaje
// //   esMantenimiento: PropTypes.bool, // se activa cuando es mantenimiento
// //   tipoMantenimiento: PropTypes.string, // puedo ser 'nuevo' || 'editar'
// //   mensaje: PropTypes.string, // mensaje que no se refleja en los mantenimiento
// //   tipo: PropTypes.string, // variantes : 'error', 'warning', 'success'
// // };

// export default function MensajesGenericos() {
//   // const { abrirModal, cerrarModal, esMantenimiento, tipoMantenimiento, mensaje, tipo } = props;
//   const { mostrarMensaje, mensaje, cerrarMensaje } = useContext(MensajeGenericoContext);
//   const [mensajeModal, setMensajeModal] = useState('');

//   useEffect(() => {
//     if (mensaje.esMantenimiento) {
//       if (mensaje.tipoMantenimiento === 'editar') setMensajeModal(`Se Modifico a ${mensaje.mensaje}`);
//       if (mensaje.tipoMantenimiento === 'nuevo') setMensajeModal(`Se registro a ${mensaje.mensaje}`);
//     } else {
//       setMensajeModal(mensaje.mensaje);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [mensaje]);

//   const filtrado = mensajesim.filter((f) => f.value === mensaje.tipo);

//   return (
//     <>
//       <Modal
//         open={mostrarMensaje}
//         onClose={() => {
//           cerrarMensaje();
//         }}
//         aria-describedby="modal-modal-description"
//         closeAfterTransition
//       >
//         <Fade in={mostrarMensaje}>
//           <Box sx={stylemodal}>
//             <Grid container spacing={1} justifyContent="center" alignItems="center">
//               <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
//                 <Image src={filtrado[0].img} />
//               </Grid>
//               <Grid item md={12} sm={12} xs={12}>
//                 <Typography variant="p">{mensaje.esMantenimiento ? mensajeModal : mensaje}</Typography>
//               </Grid>
//               <Grid item md={5} sm={2} xs={6}>
//                 <Button fullWidth variant="contained" onClick={() => cerrarMensaje()}>
//                   Aceptar
//                 </Button>
//               </Grid>
//             </Grid>
//           </Box>
//         </Fade>
//       </Modal>
//     </>
//   );
// }
