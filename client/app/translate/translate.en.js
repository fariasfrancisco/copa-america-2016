'use strict';

angular.module('copaamericaApp')
  .config(function ($translateProvider) {
    $translateProvider.translations('en', {
      //admin
      INIT_DB: 'Initialize DB',
      NOT_A_NUMBER: 'Not a Number or Out of Range!',
      UPDATE_MATCH: 'Update Match',
      SEARCH: 'Search',
      MATCH_ID: 'Match Id',
      TEAM_ID: 'Team Id',
      GOALS: 'Goals',
      SCORERS: 'Scorers',
      ADD_HOME_SCORER: 'Add Home Scorer',
      ADD_AWAY_SCORER: 'Add Away Scorer',
      SAVE: 'Save',
      INITIALIZED_SUCCESS: 'Database Initialized successfully.',
      INITIALIZED_ERROR: 'An Error occurred when Initializing the Database.',
      SAVE_HOME_TEAM_SUCCESS: 'Home Team successfully saved',
      SAVE_AWAY_TEAM_SUCCESS: 'Away Team successfully saved',
      SAVE_HOME_TEAM_ERROR: 'An Error occurred when saving Home Team',
      SAVE_AWAY_TEAM_ERROR: 'An Error occurred when saving Away Team',
      SAVE_GROUP_SUCCESS: 'Group successfully saved',
      SAVE_GROUP_ERROR: 'An Error occurred when saving Group',

      //teams
      ARG: 'Argentina',
      BOL: 'Bolivia',
      BRA: 'Brazil',
      PER: 'Peru',
      PAN: 'Panama',
      JAM: 'Jamaica',
      MEX: 'Mexico',
      PAR: 'Paraguay',
      HAI: 'Haiti',
      ECU: 'Ecuador',
      COS: 'Costa Rica',
      COL: 'Colombia',
      URU: 'Uruguay',
      USA: 'United States',
      CHI: 'Chile',
      VEN: 'Venezuela',

      //navbar
      BET: 'Bet',
      ADMIN: 'Admin',
      HOME: 'Home',
      TOURNAMENT: 'Tournament',
      BET_TABLE: 'Bet Table',
      HELLO_NAVBAR: 'Hello',
      LOGOUT: 'Logout',
      LANGUAGE: 'Language',

      //settings
      CHANGE_PASSWORD_HEADER: 'Change Password',
      CURRENT_PASSWORD: 'Current Password',
      NEW_PASSWORD: 'New Password',
      NEW_PASSWORD_LENGTH: 'Password must be at least 3 characters.',
      NEW_PASSWORD_CONFIRM: 'Confirm New Password',
      NEW_PASSWORD_SUCCESS: 'Password successfully changed.',
      INCORRECT_PASSWORD: 'Incorrect password',
      NEW_PASSWORD_MATCH: 'Passwords must match.',
      EMPTY: '',
      SAVE_PASSWORD_BUTTON: 'Save Changes',

      //main
      MAKE_A_BET: 'Make a Bet!',
      ENGLISH: 'English',
      SPANISH: 'Spanish',
      LOGIN: 'Login',
      REGISTER: 'Register',
      EMAIL: 'Email',
      PASSWORD: 'Password',
      EMAIL_PASSWORD_MISSING: 'Please enter your email and password.',
      EMAIL_INVALID: 'Please enter a valid email.',
      EMAIL_REQUIRED: 'An Email is required.',
      NAME: 'Name',
      NAME_REQUIRED: 'A Name is required.',
      CONNECT_WITH: 'Connect with',
      PASSWORD_CONFIRM: 'Confirm Password',
      REGISTER_COLUMN: 'Register!',
      REGISTER_COLUMN_P1: 'Register (or log in) below by entering your data or just connect with',
      MAKE_A_BET_P1: 'Go ahead and bet on every match.',
      MAKE_A_BET_P2: 'You earn points by guessing winners or ties (and even more for guessing the exact number of goals). You will also bet on the Golden Boot winner for even more points!',
      HOW_YOU_FARE: 'See how you fare!',
      HOW_YOU_FARE_P1: 'Check the Bet Table to compare your bet against the other players.',
      HOW_YOU_FARE_P2: 'See if you are ahead, and when you are, Brag on!',
      POINT_BREAKDOWN: 'Points Breakdown',
      POOL_SIZE: 'Pool Size',
      MATCHES: 'Matches',
      MATCHES_P1: 'You can earn +2 points for each match by guessing the winner (or a tie) and +3 more points if you guess the exact result.',
      MATCHES_P2: 'With 32 matches you can earn a total of 160 points!',
      GROUPS: 'Groups',
      GROUPS_P1: 'If you guess correctly the team that comes in first place as well as the runner up of a group you can earn +5 points.',
      GROUPS_P2: 'There are 4 groups, that makes 20 points!',
      PODIUM_P1: 'Guess the teams that will be in the Podium and earn +25 points.',
      PODIUM_P2: 'But wait, There\'s more! If they are in the correct order you will get +35 more points. That\'s 70 points total!',
      GOLDEN_BOOT_P1: 'Pick your candidate for the Golden Boot and if you are right then you will get +50 points.',
      GOLDEN_BOOT_P2: 'If two or more players are tied for this award and your guess is one of them you still get the points!',
      TOTAL_P1: 'Add all the points for a total of 300 points!',
      WELCOME: 'Welcome to the Prode',

      //tournament
      GA: 'Group A',
      GB: 'Group B',
      GC: 'Group C',
      GD: 'Group D',
      Q1: 'Quarter-Finals 1',
      Q2: 'Quarter-Finals 2',
      Q3: 'Quarter-Finals 3',
      Q4: 'Quarter-Finals 4',
      S1: 'Semi-Final 1',
      S2: 'Semi-Final 2',
      TP: 'Third Place',
      F: 'Final',
      TOP_SCORERS: 'Top Scorers',
      POINTS_SHORT: 'Pts',
      GOALS_FOR_SHORT: 'GF',
      GOALS_AGAINST_SHORT: 'GA',
      GOAL_DIFFERENCE_SHORT: 'GD',

      //bet
      AUTH_BET: 'Authorized Personnel Only. Why don\'t you try logging in before coming here?',
      AWAY_GOALS: 'Away Goals',
      AWAY_PENALTIES: 'Away Penalties',
      AWAY_TEAM: 'Away',
      BET_ERROR: 'There is an error in this group of matches.',
      CANT_BET: 'You can\'t bet anymore. It\'s past the deadline.',
      CONTINUE: 'Continue',
      DONE_BUTTON: 'Done',
      EDIT_BUTTON: 'Edit',
      EDIT_WARN: 'Are you sure? This will delete your Bet and you will have to start over!',
      EMPTY_BETS: 'There aren\'t any bets created yet.',
      FINALS: 'Final',
      FIRST_PLACE_PODIUM: '1st Place',
      GOLDEN_BOOT: 'Golden Boot',
      GOLDEN_BOOT_HEADER: 'Pick the Golden Boot winner (highest scorer of the tournament)',
      HOME_GOALS: 'Home Goals',
      HOME_PENALTIES: 'Home Penalties',
      HOME_TEAM: 'Home',
      ID: 'id',
      MAKE_BET: 'Make your Bet!',
      OK: 'Accept',
      CANCEL: 'Cancel',
      PLAYER: 'Player',
      PENALTIES: 'Penalties',
      PODIUM: 'Podium',
      QUARTER_FINALS: 'Quarter Finals',
      SAVE_BET_BUTTON: 'Save',
      SEMI_FINALS: 'Semi Finals',
      STAGE: 'Stage',
      TEAM: 'Team',
      THIRD_PLACE: 'Third Place',
      REFRESH_BUTTON: 'Refresh',
      RESTART_BUTTON: 'Start Over',
      RESTART_WARN: 'Are you sure? This will delete all your progress.',
      SECOND_PLACE_PODIUM: '2nd Place',
      THRID_PLACE_PODIUM: '3rd Place',
      USER: 'User',
      TOTAL: 'Total',
      WARNING: 'Advertencia!',

      //bettable
      MATCHES_SHORT: 'MAT',
      GA_SHORT: 'GRP A',
      GB_SHORT: 'GRP B',
      GC_SHORT: 'GRP C',
      GD_SHORT: 'GRP D',
      GOLDEN_BOOT_SHORT: 'BOT',
      PODIUM_SHORT: 'POD',
      TOTAL_SHORT: 'TOT',
      LEGEND: 'Legend',

      //FAQ
      FAQ: 'F.A.Q.',
      QUESTION1: 'How much do I have to pay to participate?',
      ANSWER1: 'The inscription fee is $70. All of the money goes into the prize pool, we don\'t make any profit from this.',
      QUESTION2: 'When is the last day to place a bet?',
      ANSWER2: 'You can place and change your bet until 06/02/2016.',
      QUESTION3: 'I registered and made a bet but it won\'t show up in the table, what gives?',
      ANSWER3: 'Once you pay, the admin will validate your account and you will see your bet in the table. If you paid and you aren\'t showing up then contact an admin to solve this issue.',
      QUESTION4: 'What if the teams I predicted would go through the group phase don\'t make it? What happens in the following stages?',
      ANSWER4: 'When you guess the results of a match you are actually betting on the result of home vs away. So, if you guessed that team A would go through but team B made it instead the results you placed for A will still apply to B. This happens in every stage, you are always betting on the result of home vs away, never specific teams.',
      QUESTION5: 'What if there are two or more players tied for the Golden Boot?',
      ANSWER5: 'You will still earn the points if the player you guessed is in the set of top scorers.',
      QUESTION6: 'What happens if there\'s a tie when the Prode ends?',
      ANSWER6_EXAMPLE: 'Example ',
      ANSWER6_TH1: 'Name',
      ANSWER6_TH2: 'Points',
      ANSWER6_PART1: 'You add the corresponding prize money for the tied positions and you distribute it between the people that are tied.',
      ANSWER6_PART2: 'Then Claudio came out 3rd and you take the prize money of the 1st and 2nd place, add it together and distribute it between Alberto and Boris.',
      ANSWER6_PART3: 'Then Boris and Claudio came out 2nd. There is no 3rd place. You add up the money corresponding to the 2nd and 3rd place and distribute it between them.',
      ANSWER6_PART4: 'Then the 4 of them came out 1st. They distribute the whole prize pool between them.',
      QUESTION7: 'I don\'t trust you guys, I believe this is all fixed.',
      ANSWER7: 'That\'s not a question. Anyway, here\'s the code repo:'
    });
  });
