import mongoose from 'mongoose';
import moment from 'moment';
import axios from 'axios';
import genSlugUrl from '../../helpers/gen-slug-url';

const CommuSchema = mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String },
  pictureUrl: { type: String },
  members: { type: Object, default: {} },
  creationTime: { type: String },
  lastUpdateTime: { type: String },
  updateBy_name: { type: String, required: true },
  updateBy_id: { type: String, required: true },
});

export const Commu = mongoose.model('communities', CommuSchema);

function getMemberCredential(usersId = []) {
  if (usersId.length == 0) return [];
  return axios({
    url: `${process.env.AUTH_SERVICE_URI}/inter-service/users/credentials`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: {
      users: usersId,
    },
  }).then(res => res.data);
}

const sqlAllAttr = `title description slug pictureUrl members creationTime lastUpdateTime updateBy_name updateBy_id`;

class CommunityModel {
  getAllOwnerCommunities(userId) {
    const condition = `members.${userId}`;
    return Commu.find({ [condition]: /\w+/gi })
      .select(sqlAllAttr)
      .then(async res => {
        let communities = [];

        for (const g of res) {
          const membersId = Object.keys(g.members);

          try {
            const members = await getMemberCredential(membersId);
            communities = [...communities, { ...g._doc, members }];
          } catch (error) {
            console.log('error::', error);
          }
        }
        return communities;
      });
  }

  getAllCommunities() {
    return Commu.find()
      .select(sqlAllAttr)
      .then(async res => {
        let communities = [];

        for (const g of res) {
          const membersId = Object.keys(g.members);

          try {
            const members = await getMemberCredential(membersId);
            communities = [...communities, { ...g._doc, members }];
          } catch (error) {
            console.log('error::', error);
          }
        }
        return communities;
      });
  }

  getOneById(id) {
    return Commu.findById(id)
      .select(sqlAllAttr)
      .then(async g => {
        let communities = {};
        const membersId = Object.keys(g.members);
        try {
          const members = await getMemberCredential(membersId);

          communities = { ...g._doc, members };
        } catch (error) {
          console.log('error::', error);
        }
        return communities;
      });
  }

  createCommunity(payload) {
    if (!payload.title) {
      return new Promise.reject(false);
    }

    const id = mongoose.Types.ObjectId();
    const slug = genSlugUrl.slug(id, payload.title);
    return Commu.create({
      _id: id,
      slug,
      ...payload,
      creationTime: moment().format(),
      lastUpdateTime: moment().format(),
    });
  }

  // todo เปลี่ยนเป็นใส่ [id]: [role] - admin, user
  async updateMembers(id, member) {
    if (!id && !member) {
      return new Promise.reject(false);
    }
    try {
      const { members } = await Commu.findById(id)
        .select('members')
        .then(payload => payload._doc);
      const newMembers = { ...members, [member.userId]: member.role };
      return Commu.findOneAndUpdate(
        { _id: id },
        { members: newMembers },
        { new: true }
      )
        .select(sqlAllAttr)
        .then(async g => {
          let communities = {};
          const membersId = Object.keys(g.members);
          try {
            const members = await getMemberCredential(membersId);

            communities = { ...g._doc, members };
            return communities;
          } catch (error) {
            console.log('error::', error);
          }
          return communities;
        });
    } catch (error) {
      console.log(error);
      return new Promise.reject(false);
    }
  }

  /**
   *
   * @param {*} id mongoObjectId
   * @param {*} memberId mongoObjectId
   * @param {*} role - admin, user
   * @param {*} userIdRequest mongoObjectId
   */
  async updateRemoveMember(id, memberId, role, userIdRequest) {
    console.log(role);
    console.log(userIdRequest);
    try {
      const groupMembers = await Commu.findOne({
        _id: id,
      })
        .select('members')
        .then(payload => payload._doc.members);
      console.log(groupMembers);
      console.log(groupMembers[userIdRequest] != 'admin');
      console.log(groupMembers && groupMembers[userIdRequest] != 'admin');
      if (
        groupMembers &&
        groupMembers[userIdRequest] != 'admin' &&
        role != 'admin'
      ) {
        console.log('here');
        return { unsuccess: true };
      }
      const { [memberId]: removed, ...newMember } = { ...groupMembers };

      return Commu.findOneAndUpdate(
        { _id: id },
        { members: newMember, lastUpdateTime: moment().format() },
        { new: true }
      )
        .select(sqlAllAttr)
        .then(async g => {
          let communities = {};
          const membersId = Object.keys(g.members);
          try {
            const members = await getMemberCredential(membersId);

            communities = { ...g._doc, members };
          } catch (error) {
            console.log('error::', error);
          }
          return communities;
        });
    } catch (error) {
      throw error;
    }
  }

  updateCommunity(id, payload) {
    if (!payload.title) {
      return new Promise.reject(false);
    }
    const slug = genSlugUrl.slug(id, payload.title);
    const { members, ...newPayload } = payload;

    return Commu.findOneAndUpdate(
      { _id: id },
      { ...newPayload, lastUpdateTime: moment().format(), slug },
      { new: true }
    )
      .select(sqlAllAttr)
      .then(async g => {
        let communities = {};
        const membersId = Object.keys(g.members);
        try {
          const members = await getMemberCredential(membersId);

          communities = { ...g._doc, members };
        } catch (error) {
          console.log('error::', error);
        }
        return communities;
      });
  }

  removeCommunity(id) {
    return Commu.findOneAndRemove({ _id: id });
  }
}

export default new CommunityModel();
