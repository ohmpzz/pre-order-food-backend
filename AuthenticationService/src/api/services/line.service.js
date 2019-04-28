// @ts-check
import * as fromLineModel from '../models/line.model';
import * as fromLineLogModel from '../models/line-log.model';
import { LINE } from '../../middlewares/line-login';

export function upsertUser(payload) {
  const { profile, userLog } = payload;

  return Promise.all([
    fromLineModel.upsertUser(profile),
    fromLineLogModel.createUserLog(userLog),
  ]);
}

export function deleteUser(payload) {
  return fromLineModel.removeUser(payload);
}

export async function addPhoneNumber(req, res) {
  const userId = req.body.id;
  const phoneNumber = req.body.phoneNumber;
  try {
    await fromLineModel.addPhoneNumber(userId, phoneNumber);
    return res.json({ success: true });
  } catch {
    return res.json({ success: false });
  }
}

export async function postLogout(req, res) {
  console.log(req.headers);
  const token = req.headers.authorization.split(' ')[1];
  console.log(token);

  // LINE.revoke_access_token();
  fromLineLogModel
    .findUserLogOne(token)
    .then(token => {
      if (token != null) {
        return LINE.revoke_access_token(token.line_token);
      }
      return null;
    })
    .catch(err => console.log('error::', err));

  // remove user log
  fromLineLogModel.removeUserLogOne(token).catch(err => console.log(err));

  res.clearCookie('token', { domain: process.env.COOKIE_DOMAIN });
  return res.json({ success: true, msg: 'logout success' });
}

export async function postFindUserLog(req, res) {
  const token = req.headers.authorization.split(' ')[1];
  const user = await fromLineLogModel.findUserLogOne(token);

  return res.json(user).end();
}
