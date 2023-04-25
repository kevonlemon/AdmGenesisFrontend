import { useContext } from 'react';
import { TextField, Button, Card, Grid, Fade, MenuItem, Box } from '@mui/material';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { UploadMultiFile } from '../../../../../components/upload';
import DateTextField from '../../../../../components/admnomina/DateTextField'
import CajaGenerica from '../../../../../components/admnomina/CajaGenerica';
import RequiredTextField from '../../../../../sistema/componentes/formulario/RequiredTextField';
import { SolicitudDocumentoContext } from '../context/solicitudDocumentoContext';


export default function Formulario() {

    const { listaMotivos,
        listaEmpleados,
        empleado,
        setEmpleado,
        numeroSolicitud,
        formulario, setFormulario, cambiarFecha, cambiarFechaInicio, cambiarFechaFin,
        limpiarCampos, Grabar,
        archivo, cargarArchivos, removerArchivo, removerTodosLosArchivos, enviarArchivos } = useContext(SolicitudDocumentoContext)

    return (
        <>
            <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                <Box sx={{ ml: 3, mr: 3, p: 1 }}>
                    <HeaderBreadcrumbs
                        heading="Solicitud de Documentos"
                        links={[{ name: 'Inicio' }, { name: 'Procesos' }, { name: 'Solicitud de Documentos' }]}
                        action={
                            <Grid container spacing={1}>
                                <Grid item md={4} sm={4} xs={12} sx={{ mr: 2 }}>
                                    <Button
                                        fullWidth
                                        variant="text"
                                        onClick={() => {
                                            limpiarCampos();
                                        }}
                                        startIcon={<InsertDriveFileRoundedIcon />}
                                    >
                                        Nuevo
                                    </Button>
                                </Grid>
                                <Grid item md={4} sm={4} xs={12}>
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
                    <Box>
                        <Grid container spacing={1}>
                            <Grid item container md={12} spacing={1}>
                                <Grid item md={3} sm={6} xs={12}>
                                    <TextField
                                        disabled
                                        size="small"
                                        fullWidth
                                        label="Número"
                                        value={numeroSolicitud}
                                        sx={{
                                            backgroundColor: '#e5e8eb',
                                            border: 'none',
                                            borderRadius: '10px',
                                            color: '#212B36',
                                        }}
                                    />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <DateTextField
                                        label='Fecha'
                                        value={formulario.fecha}
                                        onChange={cambiarFecha}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container md={12} spacing={1}>
                                <Grid item md={6} sm={12} xs={12}>
                                    <CajaGenerica
                                        estadoInicial={{
                                            codigoAlternativo: empleado.codigoalternativo,
                                            nombre: empleado.nombre
                                        }}
                                        tituloTexto={{ nombre: 'Código', descripcion: 'Empleado' }}
                                        tituloModal="Empleado"
                                        retornarDatos={(e) => {
                                            setEmpleado({
                                                codigo: e.codigo,
                                                codigoalternativo: e.codigoalternativo,
                                                nombre: e.nombre,
                                                jornada: e.jornada,
                                                departamento: e.departamento,
                                                correo: e.correo
                                            })
                                        }}
                                        datos={listaEmpleados}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container md={12} spacing={1}>
                                <Grid item md={6} sm={12} xs={12}>
                                    <RequiredTextField
                                        select
                                        label="Motivo"
                                        value={formulario.motivo}
                                        onChange={(e) => {
                                            const filtroMotivo = listaMotivos.filter(f => f.codigo === e.target.value)
                                            setFormulario({
                                                ...formulario,
                                                motivo: e.target.value,
                                                tipoMotivo: filtroMotivo[0].tipo,
                                                nombreMotivo: filtroMotivo[0].nombre,
                                                nombreTipoMotivo: filtroMotivo[0].nombreTipo,
                                            });
                                        }}
                                        fullWidth
                                        size="small"
                                    >
                                        {listaMotivos.map((f) => (
                                            <MenuItem key={f.codigo} value={f.codigo}>
                                                {f.nombre}
                                            </MenuItem>
                                        ))}
                                    </RequiredTextField>
                                </Grid>
                            </Grid>
                            <Grid item container md={12} spacing={1}>
                                <Grid item md={3} sm={6} xs={12}>
                                    <DateTextField
                                        label='Fecha Inicio'
                                        value={formulario.fechaInicio}
                                        onChange={cambiarFechaInicio}
                                    />
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                    <DateTextField
                                        label='Fecha Fin'
                                        value={formulario.fechaFin}
                                        onChange={cambiarFechaFin}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container md={12} spacing={1}>
                                <Grid item md={6} sm={12} xs={12}>
                                    <TextField
                                        multiline
                                        rows={4}
                                        size="normal"
                                        fullWidth
                                        label="Observación"
                                        value={formulario.observacion}
                                        onChange={(e) => {
                                            setFormulario({
                                                ...formulario,
                                                observacion: e.target.value,
                                            });
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Card>
            </Fade>
            {
                formulario.motivo === 'M0002' ?
                    <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                        <Card sx={{ ml: 3, mr: 3, mt: 1, p: 2 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <UploadMultiFile
                                        multiple
                                        files={archivo}
                                        onDrop={cargarArchivos}
                                        onRemove={removerArchivo}
                                        onRemoveAll={removerTodosLosArchivos}
                                        onUpload={() => enviarArchivos()}
                                        visibleButton
                                    />
                                </Grid>
                            </Grid>
                        </Card>
                    </Fade>
                : null
            }

        </>
    )

}