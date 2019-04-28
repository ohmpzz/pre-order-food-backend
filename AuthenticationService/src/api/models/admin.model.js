import mongoose from 'mongoose';
import moment from 'moment';

const DATE_NOW = moment().format();

const AdminSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: Object },
  creationTime: { type: String },
  log: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminLogs',
      required: true,
    },
  ],
});

const AdminLogSchema = mongoose.Schema({
  token: { type: String, required: true },
  signInTime: { type: String },
  isSignIn: { type: String, default: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admins',
    required: true,
  },
});

const AdminLog = mongoose.model('AdminLogs', AdminLogSchema);
const Admin = mongoose.model('Admins', AdminSchema);

export class AdminModel {
  constructor() {}

  createAdminLog(payload) {
    return AdminLog.create({ ...payload, signInTime: moment().format() }).then(
      res => {
        return res;
      }
    );
  }

  findUser({ email }) {
    return Admin.findOne({ email });
  }

  getUser({ email }) {
    return Admin.findOne({
      email,
    })
      .select('email role log')
      .populate('log');
  }

  findLog() {
    return AdminLog.find();
  }

  removeLogByToken(token) {
    return AdminLog.findOneAndDelete({ token });
  }

  removeLog() {
    return AdminLog.deleteMany();
  }

  upsertUser(payload) {
    if (!payload.email) return new Promise.reject(false);
    return Admin.findOneAndUpdate({ email: payload.email }, payload, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: { creationTime: moment().format() },
    }).then(res => {
      return res;
    });
  }

  removeUser(payload) {
    if (!payload.email) return new Promise.reject(false);

    return Admin.findOneAndRemove({ email: payload.email });
  }
}

export default new AdminModel();
