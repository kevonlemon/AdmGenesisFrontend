import { useState, useEffect, memo } from 'react';
import {
  TextField,
  Grid,
  Modal,
  Fade,
  InputAdornment,
  // MenuItem
} from '@mui/material';
// import axios from 'axios';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { estilomodal } from '../../utils/admnomina/estilos/estilos';
import TablaDatos from './TablaDatos';
// import { buscarClientesEnLinea } from '../../services/clientes_cuentas_por_cobrar/clienteServices';
// import { buscarProductosEnLinea } from '../../services/inventario_kardex/productoServices';
// import { buscarProveedorEnLinea } from '../../services/proveedores_cuentas_por_cobrar/proveedorServices';
import { BotonIconBuscar } from './Botones';
// import { URLAPIGENERAL, URLAPILOCAL } from '../../config';

ModalGenerico.propTypes = {
  busquedaEnLinea: PropTypes.bool, // activa la busqueda en linea
  // tipobusquedaEnLinea: PropTypes.string, // 'receta item'
  nombre: PropTypes.string.isRequired, // nombre del modal
  abrirModal: PropTypes.bool.isRequired, // abre el modal
  retornarDatos: PropTypes.func.isRequired, // retorna los datos del modal al momento de seleccionar
  cerrarModal: PropTypes.func.isRequired, // cierra el modal
  datos: PropTypes.array.isRequired, // datos que van a llenar la tabla
  camposAdicionales: PropTypes.array,
  activarCamposAdicionales: PropTypes.bool,
};

const estilostabla = {
  padding: '1rem',
  height: '55vh',
  width: '100%',
};

/**
 * @param {{titulo: string}} Props
 */
// eslint-disable-next-line react/prop-types
const TituloModal = ({ titulo }) => (
  <div style={{ margin: '1rem', fontWeight: 'bold' }}>
    <h2>Selección de {titulo} </h2>
  </div>
);

function ModalGenerico(props) {
  const [buscar, setBuscar] = useState('');
  const {
    busquedaEnLinea,
    nombre,
    abrirModal,
    retornarDatos,
    cerrarModal,
    datos,
    camposAdicionales,
    activarCamposAdicionales,
  } = props;
  const cabecera = [
    {
      field: 'codigoalternativo',
      headerName: 'Codigo',
      width: 150,
      valueFormatter: (params) => {
        if (params.value == null) {
          return '****';
        }

        return `${params.value}`.toUpperCase();
      },
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 300,
      valueFormatter: (params) => {
        if (params.value == null) {
          return '****';
        }

        return `${params.value}`.toUpperCase();
      },
    },
  ];
  const cabeceraUnida = activarCamposAdicionales ? [...cabecera, ...camposAdicionales] : cabecera;

  const [propiedadestabla, setPropiedadesTabla] = useState({
    columns: cabeceraUnida,
    rows: datos,
    getRowId: (rows) => rows.codigo,
    onRowDoubleClick: (e) => {
      obtenerDatosTabla(e);
    },
  });
  const obtenerDatosTabla = (e) => {
    retornarDatos(e);
  };
  const filtarDatos = (e) => {
    const texto = String(e.target.value).toUpperCase();
    setBuscar(texto);
    if (busquedaEnLinea) {
      // const esbuscar = texto.trim().length > 3;
      // if (esbuscar) {
      //   Promise.all([
      //     buscarClientesEnLinea({ cliente: texto }),
      //     buscarProductosEnLinea({ producto: texto }),
      //     buscarProveedorEnLinea({ proveedor: texto }),
      //   ]).then((res) => {
      //     /**
      //      * @type {Array<object>}
      //      */
      //     let filtro;
      //     if (tipobusquedaEnLinea === 'receta')
      //       filtro = res[0].map((m) => ({ ...m, codigoalternativo: m.codigo_Cliente, nombre: m.razon_Social }));
      //     // if (tipobusquedaEnLinea === 'producto')
      //     //   filtro = res[1].map((m) => ({ ...m, codigoalternativo: m.codigo_Producto }));
      //     // if (tipobusquedaEnLinea === 'proveedor')
      //     //   filtro = res[2].map((m) => ({ ...m, codigoalternativo: m.codigo_Proveedor }));
      //     setPropiedadesTabla({
      //       ...propiedadestabla,
      //       rows: filtro,
      //     });
      //   });
      // }
      // if (!esbuscar) {
      //   setPropiedadesTabla({
      //     ...propiedadestabla,
      //     rows: datos,
      //   });
      // }
    }
    if (!busquedaEnLinea) {
      const datosorigen = [...datos];
      const datosfiltrados = datosorigen.filter(
        (f) => String(f.nombre).toUpperCase().includes(texto) || String(f.codigo).toUpperCase().includes(texto)
      );
      setPropiedadesTabla({
        ...propiedadestabla,
        rows: datosfiltrados,
      });
    }
  };

  useEffect(() => {
    setPropiedadesTabla({
      ...propiedadestabla,
      rows: datos,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datos]);

  return (
    <Modal
      open={abrirModal}
      onClose={() => {
        cerrarModal();
        setBuscar('');
        setPropiedadesTabla({
          ...propiedadestabla,
          rows: datos,
        });
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
    >
      <Fade in={abrirModal}>
        <Box sx={estilomodal}>
          <TituloModal titulo={nombre} />
          <Box ml={2} mr={2}>
            <Grid container spacing={1} alignItems="center">
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  autoFocus
                  label="Buscar"
                  onChange={(e) => filtarDatos(e)}
                  value={buscar}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BotonIconBuscar />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
          <TablaDatos sx={propiedadestabla} estilo={estilostabla} />
        </Box>
      </Fade>
    </Modal>
  );
}

export default memo(ModalGenerico);
