import * as Commu from '../models/community.model';

class InterService {
  async checkUserOfGroup(req, res, next) {
    const userId = req.query.userId;
    const groupId = req.params.groupId;
    try {
      const community = await Commu.getOneById(groupId);
      if (community.members[userId]) {
        return res.status(200).json({ found: true, community });
      }
      return res.status(200).json({ found: false, community });
    } catch {
      return res.status(500).json({ error: 'Something went wrong!' });
    }
  }
}

export default new InterService();
