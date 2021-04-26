  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const geofenceSchema = new Schema({
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
}, {
  timestamps: true,
});

const Geofence = mongoose.model('geofence', geofenceSchema);

module.exports = Geofence;