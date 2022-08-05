import { useState, useEffect } from 'react';
import { TextField, Grid, Modal, Fade, MenuItem, Button } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid, esES } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import { estilosdetabla, estilosdatagrid, styleInactive , styleActive } from '../../../../../utils/csssistema/estilos';

const stylemodal = {
  borderRadius: '1rem',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '90%', md: '90%', lg: '45%' },
  height: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
};

ModalPacientes.propTypes = {
  nombre: PropTypes.string.isRequired,
  openModal: PropTypes.bool.isRequired,
  parentCallback: PropTypes.func.isRequired,
};

export default function ModalPacientes(props) {
  const { openModal, toggleShow, rowsData } = props;
  const codigo = props.busquedaTipo[1].tipo;
  const [rowsFilter, setRowFilter] = useState({});
  const [columns, setColums] = useState([
    {
      field: 'codigo',
      headerName: `${codigo}`,
      width: 90,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 250,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'cedula',
      headerName: 'Cédula',
      width: 250,
      headerClassName: 'super-app-theme--header',
    },
    // {
    //   field: 'estado',
    //   headerName: 'Estado',
    //   width: 100,
    //   renderCell: (param) =>
    //     param.row.estado === true ? (
    //       <Button variant="containded" style={styleActive}>
    //         Activo
    //       </Button>
    //     ) : (
    //       <Button variant="containded" style={styleInactive}>
    //         Inactivo
    //       </Button>
    //     ),
    // },
  ]);



  const [searchBy, setSearBy] = useState('codigo');
  const [buscar, setBuscar] = useState('');

  const filterTable = (buscar) => {
    
    const dataOrigin = rowsData;
    const result = dataOrigin.filter((e) => e.nombre.includes(buscar) || e.codigo.includes(buscar) || e.cedula.includes(buscar));
    setRowFilter(result);
  };

  const Buscar = (e) => {
    setBuscar(e.target.value.toUpperCase());
    filterTable(e.target.value.toUpperCase());
  };

  const onTrigger = (event) => {
    props.parentCallback(event);
  };

  useEffect(() => {
    setRowFilter(rowsData);
    setBuscar('');
  }, [rowsData]);

  return (
    <Modal
      open={openModal}
      onClose={toggleShow}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
    >
      <Fade in={openModal}>
        <Box sx={stylemodal}>
          <div style={{ margin: '1rem', fontWeight: 'bold' }}>
            <h2>{props.nombre} </h2>
          </div>
          <Box ml={2} mr={2}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                <TextField select size="small" fullWidth label="Buscar por" variant="outlined" value={searchBy}>
                  {Object.values(props.busquedaTipo).map((val) => (
                    <MenuItem onClick={() => setSearBy(val.tipo)} key={val.tipo} value={val.tipo}>
                      {val.tipo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xl={9} lg={9} md={9} sm={9} xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  autoFocus
                  label="Buscar"
                  name="buscar"
                  variant="outlined"
                  onChange={(e) => Buscar(e)}
                  value={buscar}
                />
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={estilosdetabla}
          >
            <div
              style={{
                padding: '1rem',
                height: '55vh',
                width: '100%',
              }}
            >
              <DataGrid
              sx={estilosdatagrid}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                density="compact"
                onRowDoubleClick={(e) => onTrigger(e)}
                columns={columns}
                disableColumnMenu
                rowHeight={28}
                // hideFooter
                disableColumnFilter
                rows={rowsFilter}
                getRowId={(rowsFilter) => rowsFilter.codigo}
              />
            </div>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
