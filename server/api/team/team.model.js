'use strict';

import mongoose from 'mongoose';

var TeamSchema = new mongoose.Schema({
  _id: Number,
  name: {type: String, required: true},
  players: [{
    _id: {type: Number, required: true, min: 0, max: 22},
    name: {type: String, required: true},
    goals: {type: Number, min: 0, default: 0}
  }]
});

export default mongoose.model('Team', TeamSchema);
