import * as CommuDB from './community.model';

const Commu = CommuDB.Commu;
export class UserMemberModel {
  addMember(group) {
    return Commu.findOneAndUpdate({ _id: group._id }, group).then(p => {
      return Commu.findOne({ _id: group._id });
    });
  }
}

export default new UserMemberModel();
