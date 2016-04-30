angular.module('copaamericaApp')
  .config(function ($translateProvider) {
    $translateProvider.translations('en', {
      //navbar
      BET_NAVBAR: 'Bet',
      ADMIN: 'Admin',
      HOME: 'Home',
      TOURNAMENT: 'Tournament',
      BET_TABLE: 'Bet Table',
      HELLO_NAVBAR: 'Hello',
      LOGOUT: 'Logout',

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
      MAKE_A_BET_BUTTON: 'Make a Bet!',
      ENGLISH: 'English',
      SPANISH: 'Spanish',

      //login & register
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

      //group
      GROUP_A: 'Group A',
      GROUP_B: 'Group B',
      GROUP_C: 'Group C',
      GROUP_D: 'Group D',

      //tournament
      POINTS_SHORT: 'Pts',
      GOALS_FOR_SHORT: 'GF',
      GOALS_AGAINST_SHORT: 'GA',
      GOAL_DIFFERENCE_SHORT: 'GD',

      //bet
      DONE_BUTTON: 'Done',
      SAVE_BET_BUTTON: 'Save',
      QUARTER_FINALS: 'Quarter Finals',
      SEMI_FINALS: 'Semi Finals',
      THIRD_PLACE: 'Third Place',
      FINALS: 'Final',
      PODIUM: 'Podium',
      FIRST_PLACE_PODIUM: '1st Place',
      SECOND_PLACE_PODIUM: '2nd Place',
      THRID_PLACE_PODIUM: '3rd Place',
      PENALTIES: 'Penalties',
      GOLDEN_BOOT_HEADER: 'Pick the Golden Boot winner (highest scorer of the tournament)',
      TEAM: 'Team',
      PLAYER: 'Player',
      BET_ERROR: 'There is an error in this group of matches.',

      //bet table
      USER: 'User',
      GOLDEN_BOOT: 'Golden Boot',
      TOTAL: 'Total'
    });
  });
