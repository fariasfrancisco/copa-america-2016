'use strict';

import mongoose from 'mongoose';

const states = ['group', 'quarter-final', 'semi-final', 'third-place', 'final'];

var GroupSchema = new mongoose.Schema({
  name: {type: String, required: true},
  stage: {type: String, enum: states},
  matches: [{
    _id: {type: Number, required: true, min: 1, max: 32},
    date: {type: Date, required: true},
    home: {
      _team: {type: Number, ref: 'Team'},
      goals: {type: Number, required: true, default: 0, min: 0},
      penalties: {type: Number, required: true, default: 0, min: 0}
    },
    away: {
      _team: {type: Number, ref: 'Team'},
      goals: {type: Number, required: true, default: 0, min: 0},
      penalties: {type: Number, required: true, default: 0, min: 0}
    }
  }]
});

export default mongoose.model('Group', GroupSchema);
