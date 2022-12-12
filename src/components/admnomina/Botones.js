import { Button, IconButton } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import FilePresentRoundedIcon from '@mui/icons-material/FilePresentRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import DoDisturbOnRoundedIcon from '@mui/icons-material/DoDisturbOnRounded';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';

/**
 * @param {{ propiedades: object }} Props
 */
// eslint-disable-next-line react/prop-types
export const BotonPdf = ({ propiedades }) => (
    <Button
        fullWidth
        variant="text"
        startIcon={<PictureAsPdfRoundedIcon />}
        {...propiedades}
    >
        PDF
    </Button>
)

/**
 * @param {{ propiedades: object }} Props
 */
// eslint-disable-next-line react/prop-types
export const BotonExcel = ({ propiedades }) => (
    <Button
        fullWidth
        variant="text"
        startIcon={<ViewComfyRoundedIcon />}
        {...propiedades}
    >
        Excel
    </Button>
)

/**
 * @param {{ propiedades: object }} Props
 */
// eslint-disable-next-line react/prop-types
export const BotonNuevo = ({ propiedades }) => (
    <Button
        fullWidth
        variant="text"
        startIcon={<InsertDriveFileRoundedIcon />}
        {...propiedades}
    >
        Nuevo
    </Button>
)

/**
 * @param {{ propiedades: object, texto: string }} Props
 */
// eslint-disable-next-line react/prop-types
export const BotonAgregar = ({ propiedades, texto }) => (
    <Button
        fullWidth
        variant="text"
        startIcon={<AddCircleRoundedIcon />}
        {...propiedades}
    >
        {texto}
    </Button>
)

/**
 * @param {{ propiedades: object }} Props
 */
// eslint-disable-next-line react/prop-types
export const BotonBuscar = ({ propiedades }) => (
    <Button
        fullWidth
        variant="text"
        startIcon={<SearchRoundedIcon />}
        {...propiedades}
    >
        Buscar
    </Button>
)

/**
 * @param {{ propiedades: object, texto: string }} Props
 */
// eslint-disable-next-line react/prop-types
export const BotonGrabar = ({ propiedades, texto }) => (
    <Button
        fullWidth
        variant="text"
        startIcon={<SaveRoundedIcon />}
        {...propiedades}
    >
        {texto}
    </Button>
)

/**
 * @param {{ propiedades: object }} Props
 */
// eslint-disable-next-line react/prop-types
export const BotonImprimir = ({ propiedades }) => (
    <Button
        fullWidth
        variant="text"
        startIcon={<PrintRoundedIcon />}
        {...propiedades}
    >
        Imprimir
    </Button>
)
/**
 * @param {{ propiedades: object }} Props
 */
// eslint-disable-next-line react/prop-types
export const BotonFiltro = ({ propiedades }) => (
    <Button
        fullWidth
        variant="text"
        startIcon={<TuneRoundedIcon />}
        {...propiedades}
    >
        Filtros
    </Button>
)

/**
 * @param {{ propiedades: object }} Props
 */
// eslint-disable-next-line react/prop-types
export const BotonEliminar = ({ propiedades }) => (
    <Button
        fullWidth
        variant="text"
        startIcon={<DeleteRoundedIcon />}
        {...propiedades}
    >
        Eliminar
    </Button>
)

/**
 * @param {{ propiedades: object, children: import("react").FC }} Props
 */
// eslint-disable-next-line react/prop-types
export const BotonArchivo = ({ propiedades, children }) => (
    <Button

        fullWidth
        variant="text"
        startIcon={<FilePresentRoundedIcon />}
        {...propiedades}
    >
        {children}
    </Button>
)
/**
 * @param {{ propiedades: object, texto: string }} Props
 */
// eslint-disable-next-line react/prop-types
export const BotonMarcar = ({ propiedades, texto }) => (
    <Button

        fullWidth
        variant="text"
        startIcon={<VerifiedRoundedIcon />}
        {...propiedades}
    >
        {texto}
    </Button>
)
/**
 * @param {{ propiedades: object, texto: string }} Props
 */
// eslint-disable-next-line react/prop-types
export const BotonDesmarcar = ({ propiedades, texto }) => (
    <Button
        fullWidth
        variant="text"
        startIcon={<DoDisturbOnRoundedIcon />}
        {...propiedades}
    >
        {texto}
    </Button>
)
/**
 * @param {{ propiedades: object, texto: string }} Props
 */
// eslint-disable-next-line react/prop-types
export const BotonVolver = ({ propiedades, texto }) => (
    <Button

        fullWidth
        variant="text"
        startIcon={<ArrowCircleLeftRoundedIcon />}
        {...propiedades}
    >
        {texto}
    </Button>
)
/**
 * @param {{ propiedades: object }} Props
 */
// eslint-disable-next-line react/prop-types
export const BotonIconBuscar = ({ propiedades }) => (
  <IconButton size="small" {...propiedades}>
    <SearchRoundedIcon />
  </IconButton>
);

/** Propiedades por defecto */
BotonGrabar.defaultProps = {
  texto: 'Grabar',
};
BotonAgregar.defaultProps = {
  texto: 'Agregar',
};
BotonArchivo.defaultProps = {
    children: "Xml",
}
BotonMarcar.defaultProps = {
    texto: "Marcar",
}
BotonVolver.defaultProps = {
    texto: "Volver",
}
BotonDesmarcar.defaultProps = {
    texto: "Desmarcar",
}

