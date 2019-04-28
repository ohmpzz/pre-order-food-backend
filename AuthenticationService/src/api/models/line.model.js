import mongoose from 'mongoose';
import moment from 'moment';

const DATE_NOW = moment().format();

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  picture: { type: String },
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  creationTime: { type: String, required: true },
  lastSignInTime: { type: String, default: DATE_NOW },
}).index({ name: 'text', email: 'text' });

export const User = mongoose.model('users', UserSchema);

export function addPhoneNumber(userId, phoneNumber) {
  return User.findByIdAndUpdate(userId, { phoneNumber });
}

export function getUsersCredential(users) {
  return User.find({
    uid: {
      $in: [...users],
    },
  }).select('name email picture uid phoneNumber');
}

export function findUser(uid) {
  console.log(uid);
  return User.findOne({ uid }).then(res => {
    console.log(res);
    return res;
  });
}

export function findUserByEmail(email) {
  return User.findOne({ email });
}

export function createUser(payload) {
  const creationTime = DATE_NOW;
  return User.create({ ...payload, creationTime }).then(() =>
    console.log('created')
  );
}

export function updateUser(payload) {
  return User.findOneAndUpdate(
    { uid: payload.uid },
    { ...payload, lastSignInTime: DATE_NOW }
  ).then(res => console.log('updated', res));
}

export function upsertUser(payload) {
  console.log(payload);
  return User.findOneAndUpdate({ uid: payload.uid }, payload, {
    upsert: true,
    setDefaultsOnInsert: { creationTime: DATE_NOW },
  })
    .then(res => console.log('upserted', res))
    .catch(err => console.error(err));
}

export function removeUser(payload) {
  return User.findOneAndRemove({ uid: payload.uid })
    .then(res => console.log(res))
    .catch(err => console.error(err));
}
