import Find from '../models/find.model';

class FindService {
  async findUserById(req, res) {
    console.log('here');
    const userId = req.params.userId;
    try {
      const user = await Find.findUserById(userId);
      console.log(user);
      return res.json(user);
    } catch {
      return res.status(500).json({ error: 'Some thing went wrong' });
    }
  }
}

export default new FindService();
