import { User } from './line.model';

class FindModel {
  findUserById(userId) {
    return User.findOne({ uid: userId });
  }
}

export default new FindModel();
