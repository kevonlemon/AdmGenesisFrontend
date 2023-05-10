import { useContext } from 'react';
import { Button, Card, Grid, Fade, Chip, Box, Tooltip } from '@mui/material';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { DataGrid, esES } from '@mui/x-data-grid';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { CustomNoRowsOverlay } from '../../../../../utils/csssistema/iconsdatagrid';
import { estilosdetabla, estilosdatagrid } from '../../../../../utils/csssistema/estilos';
import { BiometricoContext } from '../context/biometricoContext';

export default function Formulario() {

    const { columnas, datosExcel, CargarExcel, Grabar } = useContext(BiometricoContext);

    return (
        <>
            <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                <Box sx={{ ml: 3, mr: 3, p: 1 }}>
                    <HeaderBreadcrumbs
                        heading="Biométrico"
                        links={[{ name: 'Inicio' }, { name: 'Procesos' }, { name: 'Biométrico' }]}
                        action={
                            <Grid container spacing={2}>
                                <Grid item md={6} sm={5} xs={12} >
                                    <Button
                                        fullWidth
                                        variant="text"
                                        onClick={() => {
                                            // limpiarCampos();
                                        }}
                                        startIcon={<InsertDriveFileRoundedIcon />}
                                    >
                                        Nuevo
                                    </Button>
                                </Grid>
                                <Grid item md={6} sm={5} xs={12}>
                                    <Button
                                        fullWidth
                                        variant="text"
                                        onClick={() => {
                                            Grabar();
                                        }}
                                        startIcon={<SaveRoundedIcon />}
                                    >
                                        Grabar
                                    </Button>
                                </Grid>
                                <Grid item md={4} sm={4} xs={12}>
                                    {/* <Button
                                            // disabled={imprimir}
                                            fullWidth
                                            variant="text"
                                            target="_blank"
                                            // href={`${URLAPILOCAL}/prestamo/generarpdf?codigo=${formulario.codigoimprime}&operador=${usuario.tipo_Persona}`}
                                            startIcon={<PrintRoundedIcon />}
                                        >
                                            Imprimir
                                        </Button> */}
                                </Grid>
                            </Grid>
                        }
                    />
                </Box>
            </Fade>
            <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                <Card sx={{ ml: 3, mr: 3, p: 2 }}>
                    <Grid container spacing={1}>
                        <Grid item container xs={12} spacing={1} justifyContent="flex-end">
                            <Grid item md={3} sm={6} xs={12}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    component="label"
                                    startIcon={<FileUploadRoundedIcon />}
                                >
                                    Cargar Excel
                                    <input
                                        hidden
                                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                        type="file"
                                        onChange={CargarExcel}
                                    />
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Tooltip
                                title="Para poder subir el archivo excel, debe hacerselo con la estructura específicada (nombre de columnas)"
                            >
                                <Chip
                                    avatar={<InfoRoundedIcon />}
                                    color='primary'
                                    size='medium'
                                    label='Estructura del documento de Excel: IdBiometrico | Nombre | Departamento | Fecha | Hora'
                                />
                            </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={estilosdetabla}>
                                <div
                                    style={{
                                        padding: '1rem',
                                        height: '65vh',
                                        width: '100%'
                                    }}
                                >
                                    <DataGrid
                                        sx={estilosdatagrid}
                                        density="compact"
                                        rowHeight={28}
                                        columns={columnas}
                                        rows={datosExcel}
                                        getRowId={(rows) => rows.id}
                                        components={{
                                            NoRowsOverlay: CustomNoRowsOverlay,
                                        }}
                                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    />
                                </div>
                            </Box>
                        </Grid>
                    </Grid>
                </Card>
            </Fade>
        </>
    )
}