'use strict';

import mongoose from 'mongoose';

var TeamSchema = new mongoose.Schema({
  name: {type: String, required: true},
  players: [{
    name: {type: String, required: true},
    goals: {type: Number, min: 0, default: 0}
  }]
});

export default mongoose.model('Team', TeamSchema);
