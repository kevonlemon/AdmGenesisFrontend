import { useContext } from 'react';
import { Box, Card, IconButton, Typography, Grid } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { UploadMultiFile } from '../../../../../components/upload';
import { ValidacionDocumentosIessContext } from '../context/validacionDocsIessContext';

export default function SubidaDocumentos() {

    const { ocultarSubidaDocumentos, setOcultarSubidaDocumentos, numeroSolicitud, empleadoSolicitud,
        archivo, enviarArchivos, cargarArchivos, removerArchivo, removerTodosLosArchivos
    } = useContext(ValidacionDocumentosIessContext)

    return (
        <>
            <Box sx={{ width: '100%', mt: 1 }}>
                {
                    ocultarSubidaDocumentos ? null :
                        <Card sx={{ p: 2 }}>
                            <Grid container spacing={1}>
                                <Grid item container spacing={1} xs={12}>
                                    <Grid item md={11} sm={11} xs={11}>
                                        <Typography variant="h6">SOLICITUD Nº {numeroSolicitud}  {empleadoSolicitud}</Typography>
                                    </Grid>
                                    <Grid item md={1} sm={1} xs={1} justifyItems="center">
                                        <IconButton
                                            aria-label="close"
                                            size="medium"
                                            color="primary"
                                            onClick={() => {
                                                setOcultarSubidaDocumentos(true)
                                                removerTodosLosArchivos()
                                            }}
                                        >
                                            <CloseRoundedIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
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
                }
            </Box>
        </>
    )
}