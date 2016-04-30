angular.module('copaamericaApp')
  .config(function ($translateProvider) {
    $translateProvider.translations('es', {
      //navbar
      BET: 'Apuesta',
      ADMIN: 'Administrador',
      HOME: 'Inicio',
      TOURNAMENT: 'Torneo',
      BET_TABLE: 'Tabla de Apuestas',
      HELLO_NAVBAR: 'Hola',
      LOGOUT: 'Salir',

      //settings
      CHANGE_PASSWORD_HEADER: 'Cambiar Contraseña',
      CURRENT_PASSWORD: 'Contraseña Actual',
      NEW_PASSWORD: 'Contraseña Nueva',
      NEW_PASSWORD_LENGTH: 'La Contraseña debe tener al menos 3 caracteres.',
      NEW_PASSWORD_CONFIRM: 'Confirmar la nueva Contraseña',
      NEW_PASSWORD_SUCCESS: 'La Contraseña fue cambiada exitosamente.',
      INCORRECT_PASSWORD: 'Contraseña incorrecta',
      NEW_PASSWORD_MATCH: 'Las Contraseñas deben coincidir.',
      EMPTY: '',
      SAVE_PASSWORD_BUTTON: 'Guardar Cambios',

      //main
      MAKE_A_BET_BUTTON: 'Apostar!',

      //login & register
      LOGIN: 'Ingresar',
      REGISTER: 'Registrar',
      EMAIL: 'Email',
      PASSWORD: 'Contraseña',
      EMAIL_PASSWORD_MISSING: 'Por favor, ingrese su Email y su Contraseña.',
      EMAIL_INVALID: 'Por favor, ingrese un Email válido.',
      EMAIL_REQUIRED: 'Por favor, ingrese un Email.',
      NAME: 'Nombre',
      NAME_REQUIRED: 'Por favor, ingrese un Nombre.',
      CONNECT_WITH: 'Ingresar con',
      PASSWORD_CONFIRM: 'Confirmar Contraseña',
      
      //group
      GROUP_A: 'Grupo A',
      GROUP_B: 'Grupo B',
      GROUP_C: 'Grupo C',
      GROUP_D: 'Grupo D',

      //tournament
      POINTS_SHORT: 'Pts',
      GOALS_FOR_SHORT: 'GF',
      GOALS_AGAINST_SHORT: 'GC',
      GOAL_DIFFERENCE_SHORT: 'GD',

      //bet
      DONE_BUTTON: 'Listo',
      SAVE_BET_BUTTON: 'Guardar',
      QUARTER_FINALS: 'Cuartos de Final',
      SEMI_FINALS: 'Semifinales',
      THIRD_PLACE: 'Tercer Puesto',
      FINALS: 'Final',
      PODIUM: 'Podio',
      FIRST_PLACE_PODIUM: '1er Lugar',
      SECOND_PLACE_PODIUM: '2do Lugar',
      THRID_PLACE_PODIUM: '3er Lugar',
      PENALTIES: 'Penales',
      GOLDEN_BOOT_HEADER: 'Elegí al ganador del Botín de Oro (goleador del torneo)',
      TEAM: 'Equipo',
      PLAYER: 'Jugador',
      BET_ERROR: 'Hubo un error en este grupo de partidos.',

      //bet table
      USER: 'Usuario',
      GOLDEN_BOOT: 'Botín de Oro',
      TOTAL: 'Total'
    });
  });
