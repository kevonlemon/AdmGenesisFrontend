import { useContext } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CustomNoRowsOverlay } from '../../../../../utils/csssistema/iconsdatagrid';
import { estilosdetabla, estilosdatagrid, estilosacordeon } from '../../../../../utils/csssistema/estilos';
import { ValidacionDocumentosIessContext } from '../context/validacionDocsIessContext';

export default function Tabla() {
    const {
        columns,
        rows,
        ip, usuarioLogeado, setListValidados
    } = useContext(ValidacionDocumentosIessContext);

    return (
        <>
            <Box sx={{ width: '100%', mt: 1 }}>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={estilosacordeon}
                    >
                        <Typography sx={{ fontWeight: 'bold' }}>Solicitudes IESS</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ borderRadius: '0.5rem' }}>
                        <Box sx={estilosdetabla}>
                            <div
                                style={{
                                    padding: '1rem',
                                    height: '55vh',
                                    width: '100%',
                                }}
                            >
                                <DataGrid
                                    sx={estilosdatagrid}
                                    density="compact"
                                    rowHeight={28}
                                    columns={columns}
                                    rows={rows}
                                    getRowId={(rows) => rows.id}
                                    checkboxSelection
                                    components={{
                                        NoRowsOverlay: CustomNoRowsOverlay,
                                    }}
                                    onSelectionModelChange={(newSelectionModel) => {
                                        const datos = [];
                                        newSelectionModel.forEach((cd) => {
                                            rows.forEach((d) => {
                                                if (cd === d.id) {
                                                    const json = {
                                                        codigosolicitud: d.codigo,
                                                        validado: true,
                                                        urlDocumentoValidacion: d.urlDocValidacion,
                                                        fechaValidacion: new Date(),
                                                        maquinaValidacion: ip,
                                                        usuarioValida: usuarioLogeado,
                                                    };
                                                    datos.push(json);
                                                }
                                            });
                                        });
                                        setListValidados(datos);
                                    }}
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                />
                            </div>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </>
    )
}
