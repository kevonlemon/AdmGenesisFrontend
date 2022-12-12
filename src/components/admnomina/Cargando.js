import * as React from 'react';
import { Modal, Box, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

Cargando.propTypes = {
    abrirModal: PropTypes.bool.isRequired,
    cerrarModal: PropTypes.func.isRequired,

}

export default function Cargando(props) {
    const { abrirModal, cerrarModal } = props;
    return (
        <Modal
            open={abrirModal}
            onClose={cerrarModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                mx="auto"
                style={{
                    display: 'flex',
                    position: 'absolute',
                    margin: 'auto',
                    backgroundColor: 'black',
                    opacity: '50%',
                    width: '100vw',
                    height: '100vh',
                    zIndex: 'auto',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Box mx="auto">
                    <CircularProgress style={{ color: '#2196F3' }} />
                </Box>
            </Box>
        </Modal>
    );
}
