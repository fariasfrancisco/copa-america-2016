'use strict';

angular.module('copaamericaApp')
  .config(function ($translateProvider) {
    $translateProvider.translations('es', {
      //admin
      INIT_DB: 'Inicializar BD',
      NOT_A_NUMBER: 'No es un número o fuera de rango!',
      UPDATE_MATCH: 'Actualizar Partido',
      SEARCH: 'Buscar',
      MATCH_ID: 'ID Partido',
      TEAM_ID: 'ID Equipo',
      GOALS: 'Goles',
      SCORERS: 'Goleadores',
      ADD_HOME_SCORER: 'Agregar Goleador Local',
      ADD_AWAY_SCORER: 'Agregar Goleador Visitante',
      SAVE: 'Guardar',
      INITIALIZED_SUCCESS: 'Base de Datos Inicializada Exitosamente.',
      INITIALIZED_ERROR: 'Error al Inicializar la Base de Datos.',
      SAVE_HOME_TEAM_SUCCESS: 'Equipo Local Guardado Exitosamente',
      SAVE_AWAY_TEAM_SUCCESS: 'Equipo Visitante Guardado Exitosamente',
      SAVE_HOME_TEAM_ERROR: 'Error al guardar Equipo Local',
      SAVE_AWAY_TEAM_ERROR: 'Error al guardar Equipo Visitante',
      SAVE_GROUP_SUCCESS: 'Grupo Guardado Exitósamente',
      SAVE_GROUP_ERROR: 'Error al guardar Grupo',

      //teams
      ARG: 'Argentina',
      BOL: 'Bolivia',
      BRA: 'Brasil',
      PER: 'Perú',
      PAN: 'Panamá',
      JAM: 'Jamaica',
      MEX: 'México',
      PAR: 'Paraguay',
      HAI: 'Haití',
      ECU: 'Ecuador',
      COS: 'Costa Rica',
      COL: 'Colombia',
      URU: 'Uruguay',
      USA: 'Estados Unidos',
      CHI: 'Chile',
      VEN: 'Venezuela',

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
      MAKE_A_BET: 'Apostá!',
      ENGLISH: 'Inglés',
      SPANISH: 'Español',
      LOGIN: 'Ingresar',
      REGISTER: 'Registrar',
      EMAIL: 'Email',
      PASSWORD: 'Contraseña',
      EMAIL_PASSWORD_MISSING: 'Por favor, ingrese su Email y su Contraseña.',
      EMAIL_INVALID: 'Por favor, ingrese un Email válido.',
      EMAIL_REQUIRED: 'Por favor, ingrese un Email.',
      NAME: 'Nombre',
      NAME_REQUIRED: 'Por favor, ingrese un Nombre.',
      CONNECT_WITH: 'Conectar con',
      OR_LOGIN_WITH: 'O Ingresar Con',
      OR_REGISTER_WITH: 'O Registrar Con',
      PASSWORD_CONFIRM: 'Confirmar Contraseña',
      REGISTER_COLUMN: 'Registrate!',
      REGISTER_COLUMN_P1: 'Registrate (o Ingresá) abajo con tus datos o sólo ingresá con',
      MAKE_A_BET_P1: 'Hacé una apuesta por partido.',
      MAKE_A_BET_P2: 'Ganá puntos acertando ganadores o empates (y conseguí más puntos acertando la cantidad exacta de goles). También apostá por el ganador del Botín de Oro y ganá más puntos!',
      HOW_YOU_FARE: 'Compará puntos!',
      HOW_YOU_FARE_P1: 'Compará los resultados de tu apuesta con los de los demás jugadores.',
      HOW_YOU_FARE_P2: 'Fijate si vas primero y después echácelo en cara a todos!',
      POINT_BREAKDOWN: 'Distribución de los Puntos',
      MATCHES: 'Partidos',
      MATCHES_P1: 'Podés ganar +2 puntos por cada partido acertando el ganador (o el empate) y si además acertás el resultado ganas +3 puntos más.',
      MATCHES_P2: 'Con 32 partidos podés ganar un total de 160 puntos!',
      GROUPS: 'Grupos',
      GROUPS_P1: 'Si adivinás correctamente los equipos que terminan en primer y segundo puesto de un grupo podés sumar +5 puntos.',
      GROUPS_P2: 'Hay 4 grupos, eso suma 20 puntos!',
      PODIUM_P1: 'Acertá los equipos que conforman el Podio y ganá +25 puntos.',
      PODIUM_P2: 'Pero aún hay más! Si los equipos están en el orden correcto obtenés +35 puntos más. En total son 70 puntos!',
      GOLDEN_BOOT_P1: 'Elegí tu candidato para el Botín de Oro y si acertás sumás +50 puntos.',
      GOLDEN_BOOT_P2: 'Si dos o más jugadores están empatados en goles y elegiste uno de ellos, entonces obtenés los puntos igualmente!',
      TOTAL_P1: 'Sumá todos los puntos para un total de 300 puntos!',
      WELCOME: 'Bienvenido al Prode',

      //tournament
      GA: 'Grupo A',
      GB: 'Grupo B',
      GC: 'Grupo C',
      GD: 'Grupo D',
      Q1: 'Cuartos de Final 1',
      Q2: 'Cuartos de Final 2',
      Q3: 'Cuartos de Final 3',
      Q4: 'Cuartos de Final 4',
      S1: 'Semifinal 1',
      S2: 'Semifinal 2',
      TP: 'Tercer Puesto',
      F: 'Final',
      POINTS_SHORT: 'Pts',
      GOALS_FOR_SHORT: 'GF',
      GOALS_AGAINST_SHORT: 'GC',
      GOAL_DIFFERENCE_SHORT: 'GD',

      //bet
      AWAY_GOALS: 'Goles Visitante',
      AWAY_PENALTIES: 'Penales Visitante',
      AWAY_TEAM: 'Visitante',
      BET_ERROR: 'Hubo un error en este grupo de partidos.',
      CANT_BET: 'Ya no se puede apostar más. La fecha límite ya fue superada.',
      CONTINUE: 'Continar',
      DONE_BUTTON: 'Listo',
      EDIT_BUTTON: 'Editar',
      EDIT_WARN: '¿Estás Seguro? Esto va a eliminar tu Apuesta y vas a tener que empezar de nuevo!',
      EMPTY_BETS: 'No hay apuestas creadas todavía.',
      FINALS: 'Final',
      FIRST_PLACE_PODIUM: '1er Lugar',
      GOLDEN_BOOT: 'Botín de Oro',
      GOLDEN_BOOT_HEADER: 'Elegí al ganador del Botín de Oro (goleador del torneo)',
      HOME_GOALS: 'Goles Local',
      HOME_PENALTIES: 'Penales Local',
      HOME_TEAM: 'Local',
      ID: 'id',
      MAKE_BET: 'Armá tu apuesta!',
      PLAYER: 'Jugador',
      PENALTIES: 'Penales',
      PODIUM: 'Podio',
      QUARTER_FINALS: 'Cuartos de Final',
      RESTART_BUTTON: 'Reiniciar',
      RESTART_WARN: '¿Estás Seguro? Esto va a eliminar todo tu progreso.',
      SAVE_BET_BUTTON: 'Guardar',
      SECOND_PLACE_PODIUM: '2do Lugar',
      SEMI_FINALS: 'Semifinales',
      STAGE: 'Etapa',
      TEAM: 'Equipo',
      THIRD_PLACE: 'Tercer Puesto',
      THRID_PLACE_PODIUM: '3er Lugar',
      USER: 'Usuario',
      TOTAL: 'Total',
      WARNING: 'Advertencia!',

      //FAQ
      FAQ: 'Preguntas Frecuentes',
      QUESTION1: '¿Cuánto hay que pagar para participar?',
      ANSWER1: 'Participar cuesta $70. El 100% de eso va para el pozo. Nosotros no lucramos con esto.',
      QUESTION2: '¿Hasta cuándo puedo apostar?',
      ANSWER2: 'Tenés tiempo de apostar y cambiar tu apuesta hasta el 02/06/2016.',
      QUESTION3: 'Me registré e hice mi apuesta pero no aparece en la tabla, ¿qué onda?',
      ANSWER3: 'Una vez pagues el administrador va a validar tu cuenta. Si pagaste y aun así no aparecés en la tabla contactate con alguno de los administradores para que te den una solución.',
      QUESTION4: '¿Qué pasa si los equipos que dije que pasaban la fase de grupo no avanzan? ¿Qué pasa con las siguientes fases?',
      ANSWER4: 'Cuando completás los resultados de un partido, en realidad estás apostando por local vs visitante en cada partido. Entonces, si apostaste que pasaba el equipo A pero en realidad avanzó el equipo B, los resultados que pusiste para A se aplican a B. Lo mismo ocurre en todas las fases, por detrás siempre se calculan los resultados en base al local vs el visitante, nunca por un equipo específico.',
      QUESTION5: '¿Qué pasa si hay más de un jugador empatado para el premio del botín de oro?',
      ANSWER5: 'Te llevás los puntos igual. Siempre que el jugador por el que apostaste esté dentro del conjunto de goleadores vas a tener los puntos.',
      QUESTION6: '¿Que pasa si hay empate al final del prode?',
      ANSWER6_EXAMPLE: 'Ejemplo ',
      ANSWER6_TH1: 'Nombre',
      ANSWER6_TH2: 'Puntos',
      ANSWER6_PART1: 'Se suma la plata que le corresponde a las posiciones y se reparte entre las personas.',
      ANSWER6_PART2: 'Se considera que Claudio salió 3ro y se toma el premio del 1er y 2do puesto, se lo suma y se reparte entre Alberto y Boris.',
      ANSWER6_PART3: 'Se considera que Boris y Claudio salieron 2dos, no hay 3ro y se toma el premio del 2do y 3er puesto, se lo suma y se reparte entre ambos.',
      ANSWER6_PART4: 'Se considera que los 4 salieron 1ros. Se toma todo el pozo y se lo divide entre ellos.',
      QUESTION7: 'No confío en ustedes, creo que está todo arreglado.',
      ANSWER7: 'No es una pregunta, pero acá tenés el repo de git con el código:'
    });
  });
