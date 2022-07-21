
import { useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { List, Box, ListSubheader } from '@mui/material';
//
import { NavListRoot } from './NavList';
// routes
import { PATH_DASHBOARD, PATH_OPSISTEMA } from '../../../routes/paths';
import { ordenarListaJson } from '../../../utils/sistema/funciones';
// components
// import Label from '../../../components/Label';
import SvgIconStyle from '../../SvgIconStyle';
// ----------------------------------------------------------------------
const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  inventariokardex: getIcon('ic_inventariokardex'),
};

export const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.overline,
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter,
    }),
  })
);

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
  isCollapse: PropTypes.bool,
  navConfig: PropTypes.array,
};


export default function NavSectionVertical({ navConfig, isCollapse = false, ...other }) {
  const navlist = [];
  const navlistdef = []
  const opciones = JSON.parse(window.localStorage.getItem('opciones'));
  try {
    let rutas = opciones ? opciones.opciones : '';
    const ROOTS_SISTEMA = '/sistema';
    let childrenlist = [];
    if (rutas.length !== 0 && typeof rutas !== 'string') {
      rutas = ordenarListaJson(rutas, 'menu', 'asc');
      let pivote = rutas[0].menu;
      let siguiente;
      for (let index = 0; index < rutas.length; index += 1) {
        siguiente = rutas[index].menu;
        if (pivote === siguiente) {
          if (rutas[index].mantenimiento === 'N') {
            childrenlist.push(
              {
                title: rutas[index].nombre,
                path: `${ROOTS_SISTEMA}/${rutas[index].menu?.toLocaleLowerCase()}${rutas[index].url}`
              }
            )
          }
          if (rutas.length - 1 === index) {
            navlist.push(
              {
                title: rutas[index].menu,
                icon: ICONS.inventariokardex,
                children: childrenlist
              }
            )
          }
        } else {
          // console.log("nombres", rutas[index].menu)
          navlist.push(
            {
              title: rutas[index - 1].menu,
              icon: ICONS.inventariokardex,
              children: childrenlist
            }
          )
          pivote = rutas[index].menu;
          childrenlist = []
          index -= 1
        }
      }
    }
  } catch (error) {
    navlistdef.push(
      {
        title: 'Inicio',
        path: PATH_DASHBOARD.root,
        icon: ICONS.analytics
      },
    )
  }
  const navConfig1 = [
    // GENERAL
    // ----------------------------------------------------------------------
    {
      subheader: 'APLICACIONES',
      items: [
        ...navlist,
        ...navlistdef

      ],
    },
  ];
  // console.log(navConfig1)
  return (
    <Box {...other}>
      {navConfig1.map((group) => (
        <List key={group.subheader} disablePadding sx={{ px: 2 }}>
          <ListSubheaderStyle
            sx={{
              ...(isCollapse && {
                opacity: 0,
              }),
            }}
          >
            {group.subheader}
          </ListSubheaderStyle>

          {group.items.map((list) => (
            <NavListRoot key={list.title} list={list} isCollapse={isCollapse} />
          ))}
        </List>
      ))}
    </Box>
  );
}
