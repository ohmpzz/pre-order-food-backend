import mongoose from 'mongoose';
import moment from 'moment';

const UserLogSchema = mongoose.Schema({
  jwt_token: { type: String, required: true },
  line_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
  expires_in: { type: String, required: true },
  uid: { type: String, required: true },
  creationTime: { type: String },
});

const userLog = mongoose.model('userLog', UserLogSchema);

export function createUserLog(payload) {
  return userLog
    .create({ ...payload, creationTime: moment().format() })
    .then(res => {
      console.log('created');
      return res;
    })
    .catch(err => console.error(err));
}

export function removeUserLogOne(jwtToken) {
  return userLog
    .findOneAndRemove({ jwt_token: jwtToken })
    .then(res => {
      console.log('deleted', res);
      return res;
    })
    .catch(err => console.error(err));
}

export function findUserLogOne(jwtToken) {
  return userLog.findOne({ jwt_token: jwtToken });
}
