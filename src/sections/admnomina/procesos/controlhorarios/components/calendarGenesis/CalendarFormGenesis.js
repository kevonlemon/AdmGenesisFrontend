import { useContext } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Button, Tooltip, TextField, IconButton, DialogTitle, Modal, Stack } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import es from 'date-fns/locale/es';
import { LoadingButton, MobileDateTimePicker, TimePicker } from '@mui/lab';
import { useDispatch } from '../../../../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../../../../redux/slices/calendar';
import Iconify from '../../../../../../components/Iconify';
import { ColorSinglePicker } from '../../../../../../components/color-utils';
import { FormProvider, RHFTextField, RHFSwitch } from '../../../../../../components/hook-form';
import RequiredTextField from '../../../../../../components/admnomina/RequiredTextField';
import DisableTextField from '../../../../../../components/admnomina/DisabledTextField';
import moment from '../../../../../../utils/admnomina/funciones/funciones';
import { CalendarioContext } from '../../context/calendarioContext'

// ----------------------------------------------------------------------

const COLOR_OPTIONS = [
  '#00AB55', // theme.palette.primary.main,
  '#1890FF', // theme.palette.info.main,
  '#54D62C', // theme.palette.success.main,
  '#FFC107', // theme.palette.warning.main,
  '#FF4842', // theme.palette.error.main
  '#04297A', // theme.palette.info.darker
  '#7A0C2E', // theme.palette.error.darker
];

const getInitialValues = (event, range) => {
  const _event = {
    title: '',
    description: '',
    textColor: '#1890FF',
    allDay: false,
    start: range ? new Date(range.start) : new Date(),
    end: range ? new Date(range.end) : new Date(),
  };

  if (event || range) {
    return merge({}, _event, event);
  }

  return _event;
};

// ----------------------------------------------------------------------

const stylemodal = {
  borderRadius: '1rem',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '100%', sm: '45%', md: '30%', lg: '30%' },
  height: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
};

CalendarFormGenesis.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
};

export default function CalendarFormGenesis({ event, range, onCancel }) {
  const { mensajeSistemaPregunta, fechaSeleccionada, formulario, setFormulario, abrirModal, cerrarModal, tipoModal, selectedEvent, events } = useContext(CalendarioContext)
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const isCreating = Object.keys(event).length === 0;
  
  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    description: Yup.string().max(5000),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: getInitialValues(event, range),
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const newEvent = {
        title: data.title,
        description: data.description,
        textColor: data.textColor,
        allDay: data.allDay,
        start: data.start,
        end: data.end,
      };
      if (event.id) {
        dispatch(updateEvent(event.id, newEvent));
        enqueueSnackbar('Update success!');
      } else {
        enqueueSnackbar('Create success!');
        dispatch(createEvent(newEvent));
      }
      onCancel();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const guardarHorario = async () => {
    try {
      if (tipoModal === 'Editar Horario') {
        const horaEntradaStr = moment(formulario.horaEntrada).format('HH:mm:ss')
        const horaSalidaStr = moment(formulario.horaSalida).format('HH:mm:ss')
        // const horarioActualizado = {
        //   ...selectedEvent,
        //   horaEntrada: horaEntradaStr,
        //   horaSalida: horaSalidaStr,
        //   title: `${horaEntradaStr.substring(0,5)} - ${horaSalidaStr.substring(0,5)}`
        // }
        console.log('events', events);
        const horarioActualizado = events.map((m) => ({
          ...m,
          horaEntrada: m.id === selectedEvent.id ? horaEntradaStr : m.horaEntrada,
          horaSalida: m.id === selectedEvent.id ? horaSalidaStr : m.horaSalida,
          title: m.id === selectedEvent.id ? `${horaEntradaStr.substring(0,5)} - ${horaSalidaStr.substring(0,5)}` : m.title
        }))
        console.log("🚀 ~ file: CalendarFormGenesis.js:142 ~ horarioActualizado ~ horarioActualizado:", horarioActualizado)
        dispatch(updateEvent(selectedEvent.id, horarioActualizado, 'horarios'));
        enqueueSnackbar('Horario Actualizado!');
        cerrarModal();
      } else {
        console.log('fechaselect', fechaSeleccionada) 
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  const handleDelete = async () => {
    if (!event.id) return;
    try {
      onCancel();
      dispatch(deleteEvent(event.id));
      enqueueSnackbar('Horario eliminado!');
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarHorario = () => {
    mensajeSistemaPregunta({
      mensaje: `¿Está seguro de eliminar este horario?`,
      ejecutarFuncion: () => {
        handleDelete();
        cerrarModal();
      },
    });
  }

  const values = watch();
  // console.log('values?',values)
  const isDateError = isBefore(new Date(values.end), new Date(values.start));

  return (
    // <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    //   <Stack spacing={3} sx={{ p: 3 }}>
    //     <RHFTextField name="title" label="Title" />

    //     <RHFTextField name="description" label="Description" multiline rows={4} />

    //     <RHFSwitch name="allDay" label="All day" />

    //     <Controller
    //       name="start"
    //       control={control}
    //       render={({ field }) => (
    //         <MobileDateTimePicker
    //           {...field}
    //           label="Start date"
    //           inputFormat="dd/MM/yyyy hh:mm a"
    //           renderInput={(params) => <TextField {...params} fullWidth />}
    //         />
    //       )}
    //     />

    //     <Controller
    //       name="end"
    //       control={control}
    //       render={({ field }) => (
    //         <MobileDateTimePicker
    //           {...field}
    //           label="End date"
    //           inputFormat="dd/MM/yyyy hh:mm a"
    //           renderInput={(params) => (
    //             <TextField
    //               {...params}
    //               fullWidth
    //               error={!!isDateError}
    //               helperText={isDateError && 'End date must be later than start date'}
    //             />
    //           )}
    //         />
    //       )}
    //     />

    //     <Controller
    //       name="textColor"
    //       control={control}
    //       render={({ field }) => (
    //         <ColorSinglePicker value={field.value} onChange={field.onChange} colors={COLOR_OPTIONS} />
    //       )}
    //     />
    //   </Stack>

    //   <DialogActions>
    //     {!isCreating && (
    //       <Tooltip title="Delete Event">
    //         <IconButton onClick={handleDelete}>
    //           <Iconify icon="eva:trash-2-outline" width={20} height={20} />
    //         </IconButton>
    //       </Tooltip>
    //     )}
    //     <Box sx={{ flexGrow: 1 }} />

    //     <Button variant="outlined" color="inherit" onClick={onCancel}>
    //       Cancel
    //     </Button>

    //     <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
    //       Add
    //     </LoadingButton>
    //   </DialogActions>
    // </FormProvider>
    <>
      <Modal
        open={abrirModal}
        onClose={cerrarModal}
        closeAfterTransition
      >
        <Stack spacing={3} sx={{ p: 5 }}>
          <Card sx={stylemodal}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <DialogTitle>{tipoModal}</DialogTitle>
              </Grid>
              <Grid item container xs={12} sx={{ mt: 1, mr: 2, ml: 2, mb: 2 }}>
                <Grid item container spacing={1}>
                  <Grid item xs={12}>
                    <DisableTextField 
                      fullWidth
                      disabled
                      size="small"
                      label="Fecha"
                      variant="outlined"
                      value={formulario.fecha} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                      <TimePicker
                        ampm={false}
                        openTo="hours"
                        views={['hours', 'minutes']}
                        inputFormat="HH:mm"
                        mask="__:__"
                        label="Hora de Ingreso"
                        value={formulario.horaEntrada}
                        onChange={(newValue) => {
                          setFormulario({
                            ...formulario,
                            horaEntrada: newValue,
                          });
                        }}
                        renderInput={(params) => <RequiredTextField fullWidth size="small" {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                      <TimePicker
                        ampm={false}
                        openTo="hours"
                        views={['hours', 'minutes']}
                        inputFormat="HH:mm"
                        mask="__:__"
                        label="Hora de Salida"
                        value={formulario.horaSalida}
                        onChange={(newValue) => {
                          setFormulario({
                            ...formulario,
                            horaSalida: newValue,
                          });
                        }}
                        renderInput={(params) => <RequiredTextField fullWidth size="small" {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item container xs={12} spacing={1} justifyContent="flex-end">
                    {
                      tipoModal === 'Editar Horario' ? 
                      <Grid item xs={4}>
                        <Tooltip title="Eliminar Horario">
                          <IconButton onClick={eliminarHorario}>
                            <Iconify icon="eva:trash-2-outline" width={20} height={20} />
                          </IconButton>
                        </Tooltip> 
                      </Grid> : null
                    }
                    <Grid item xs={4}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => { guardarHorario() }}
                      >
                        Guardar
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => { cerrarModal() }}
                      >
                        Cancelar
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Stack>
      </Modal>
    </>
  );
}
