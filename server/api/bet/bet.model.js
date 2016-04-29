'use strict';

import mongoose from 'mongoose';

var BetSchema = new mongoose.Schema({
  _user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: {type: String, required: true},
  matches: [{
    _id: {type: Number, min: 0, max: 31, required: true},
    home: {
      goals: {type: Number, min: 0, required: true},
      penalties: {type: Number, min: 0, required: true}
    },
    away: {
      goals: {type: Number, min: 0, required: true},
      penalties: {type: Number, min: 0, required: true}
    }
  }],
  groups: [{
    name: {type: String, required: true},
    first: {type: Number, min: 0, max: 15, required: true},
    second: {type: Number, min: 0, max: 15, required: true}
  }],
  podium: {
    first: {type: Number, min: 0, max: 15, required: true},
    second: {type: Number, min: 0, max: 15, required: true},
    third: {type: Number, min: 0, max: 15, required: true}
  },
  goldenBoot: {
    _team: {type: Number, min: 0, max: 15, required: true},
    _player: {type: Number, min: 0, max: 22, required: true}
  }
});

export default mongoose.model('Bet', BetSchema);
