import { getUsersCredential } from '../models/line.model';

class UserCredentialService {
  async getUsersCredential(req, res) {
    const users = req.body.users;
    try {
      const credentials = await getUsersCredential(users);

      return res.json(credentials);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'something went wrong' });
    }
  }
}

export default new UserCredentialService();
