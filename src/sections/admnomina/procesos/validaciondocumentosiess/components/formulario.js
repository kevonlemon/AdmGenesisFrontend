import { useContext } from 'react';
import { Box, Grid, Button, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import HeaderBreadcrumbs from '../../../../../components/cabecerainforme';
import DateTextField from '../../../../../components/admnomina/DateTextField'
import CajaGenerica from '../../../../../components/admnomina/CajaGenerica';
import { estilosacordeon } from '../../../../../utils/csssistema/estilos';
import { ValidacionDocumentosIessContext } from '../context/validacionDocsIessContext';

export default function Formulario() {
    const {
        listaEmpleados, listValidados,
        empleadoDesde, empleadoHasta,
        setEmpleadoDesde, setEmpleadoHasta,
        formulario, cambiarFechaDesde, cambiarFechaHasta,
        buscarSolicitudesIESS, Procesar, limpiarCampos
    } = useContext(ValidacionDocumentosIessContext)

    return (
        <>
            <Box>
                <Grid container>
                    <Grid item md={12} sm={12} xs={12}>
                        <Box>
                            <HeaderBreadcrumbs
                                heading="Validación Documentos IESS"
                                links={[
                                    { name: 'Inicio' },
                                    { name: 'Validación Documentos IESS' },
                                    { name: 'Procesos' },
                                ]}
                                action={
                                    <Button
                                        fullWidth
                                        disabled={listValidados.length === 0}
                                        // variant="text"
                                        variant="contained"
                                        size="medium"
                                        // disableElevation
                                        startIcon={<SaveRoundedIcon />}
                                        onClick={() => Procesar()}
                                    >
                                        Procesar
                                    </Button>
                                }
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={estilosacordeon}
                >
                    <Typography sx={{ fontWeight: 'bold' }}>Busqueda</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={1}>
                        <Grid item container spacing={1} md={3}>
                            <Grid item xs={12}>
                                <DateTextField
                                    label='Fecha Desde'
                                    value={formulario.fechadesde}
                                    onChange={cambiarFechaDesde}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DateTextField
                                    label='Fecha Hasta'
                                    value={formulario.fechahasta}
                                    onChange={cambiarFechaHasta}
                                />
                            </Grid>
                        </Grid>
                        <Grid item container spacing={1} md={6}>
                            <Grid item xs={12}>
                                <CajaGenerica
                                    estadoInicial={{
                                        codigoAlternativo: empleadoDesde.codigoalternativo,
                                        nombre: empleadoDesde.nombre
                                    }}
                                    tituloTexto={{ nombre: 'Código', descripcion: 'Empleado Desde' }}
                                    tituloModal="Empleado Desde"
                                    retornarDatos={(e) => {
                                        setEmpleadoDesde({
                                            codigo: e.codigo,
                                            codigoalternativo: e.codigoalternativo,
                                            nombre: e.nombre
                                        })
                                    }}
                                    datos={listaEmpleados}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CajaGenerica
                                    estadoInicial={{
                                        codigoAlternativo: empleadoHasta.codigoalternativo,
                                        nombre: empleadoHasta.nombre
                                    }}
                                    tituloTexto={{ nombre: 'Código', descripcion: 'Empleado Hasta' }}
                                    tituloModal="Empleado Hasta"
                                    retornarDatos={(e) => {
                                        setEmpleadoHasta({
                                            codigo: e.codigo,
                                            codigoalternativo: e.codigoalternativo,
                                            nombre: e.nombre
                                        })
                                    }}
                                    datos={listaEmpleados}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={1} sx={{ mt: 1 }} justifyContent="flex-start">
                        <Grid item md={1.2} sm={2} xs={6}>
                            <Button
                                fullWidth
                                variant="text"
                                size="small"
                                onClick={() => limpiarCampos()}
                                startIcon={<InsertDriveFileRoundedIcon />}
                            >
                                Nuevo
                            </Button>
                        </Grid>
                        <Grid item md={1.2} sm={2} xs={6}>
                            <Button
                                fullWidth
                                variant="text"
                                size="small"
                                onClick={() => buscarSolicitudesIESS()}
                                startIcon={<SearchRoundedIcon />}
                            >
                                Buscar
                            </Button>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </>
    )
}