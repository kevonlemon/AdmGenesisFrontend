import { memo } from 'react';
import PropTypes from 'prop-types';
import { DataGrid, esES } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { IconoDataGrid } from './IconoDataGrid';
import { estilosdetabla, estilosdatagrid } from '../../utils/admnomina/estilos/estilos';

TablaDatos.propTypes = {
  sx: PropTypes.object, // propiedades del datagrid,
  estilo: PropTypes.object, // propiedades de div
};

function TablaDatos(props) {
  const { sx, estilo } = props;
  return (
    <Box sx={estilosdetabla}>
      <div style={estilo}>
        <DataGrid
          density="compact"
          rowHeight={28}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          sx={estilosdatagrid}
          components={{
            NoRowsOverlay: IconoDataGrid,
          }}
          {...sx}
        />
      </div>
    </Box>
  );
}
export default memo(TablaDatos);
