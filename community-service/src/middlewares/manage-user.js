import { getOneById } from '../api/models/community.model';

/**
 * Middleware CRUD Member in community
 */
export class ManageUser {
  async validate(req, res, next) {
    const groupId = req.params.groupId;
    const userId = req.user.sub;

    if (req.user.roles['admin']) {
      return next();
    }

    try {
      const group = await getOneById(groupId).then(p => {
        return p._doc;
      });
      if (group.members[userId]) {
        return next();
      } else {
        return res.json(200).json({ code: 'not found user' });
      }
    } catch (error) {
      return res.status(500).json({ code: 'Somethings went wrong' });
    }
  }
}

export default new ManageUser();
