'use strict';

import mongoose from 'mongoose';

var BetSchema = new mongoose.Schema({
  _user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  matches: [{
    _id: {type: Number, min: 0, max: 32, required: true},
    home: {
      goals: {type: Number, min: 0, required: true},
      penalties: {type: Number, min: 0, required: true}
    },
    away: {
      goals: {type: Number, min: 0, required: true},
      penalties: {type: Number, min: 0, required: true}
    }
  }]
});

export default mongoose.model('Bet', BetSchema);
