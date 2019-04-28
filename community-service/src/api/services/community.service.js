import axios from 'axios';
import fromCommuModel from '../models/community.model';

class CommunityService {
  async addMember(req, res) {
    const id = req.params.groupId;
    try {
      const user = await axios({
        url: `${process.env.AUTH_SERVICE_URI}/user/find/${req.body.userId}`,
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
      }).then(res => res.data);
      if (!user || user.code) {
        return res.json({ error: 'user not found' });
      }
      const userId = user.uid;
      const community = await fromCommuModel.updateMembers(id, {
        userId,
        name: user.name,
      });
      return res.status(200).json(community);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Somethings went wrong asd' });
    }
  }

  async removeMember(req, res) {
    const id = req.params.groupId;
    const memberId = req.body.userId;
    if (!memberId) {
      return res.status(400).json({ error: 'Require Information' });
    }
    try {
      const community = await fromCommuModel.updateRemoveMember(id, memberId);
      return res.json(community);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async getAllCommunities(req, res) {
    try {
      const communities = await fromCommuModel.getAllCommunities();
      console.log(communities);
      return res.json(communities);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Something went wrong!' });
    }
  }

  async getCommunityById(req, res) {
    const id = req.params.id;
    try {
      const community = await fromCommuModel.getOneById(id);
      return res.json(community);
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, msg: 'Something went wrong!' });
    }
  }

  async createCommunity(req, res) {
    const payload = req.body;
    try {
      const community = await fromCommuModel
        .createCommunity({
          ...payload,
          updateBy_name: req.user.email,
          updateBy_id: req.user.sub,
        })
        .then(payload => payload._doc);
      return res.status(201).json(community);
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: 'Something went wrong!' });
    }
  }
  async updateCommunity(req, res) {
    const id = req.params.id;
    const payload = req.body;
    try {
      const group = await fromCommuModel.updateCommunity(id, payload);
      return res.json({ ...group });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: 'Something went wrong!' });
    }
  }
  async removeCommunity(req, res) {
    const id = req.params.id;
    try {
      await fromCommuModel.removeCommunity(id);
      return res.json({ success: true, msg: `${id} removed` });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: 'Something went wrong!' });
    }
  }
}

export default new CommunityService();
