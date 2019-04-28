import Search from '../models/search.model';
class SearchService {
  async getUsersByNameOrEmail(req, res) {
    const q = req.query.q;
    const filter = {
      limit: req.query.limit,
    };

    try {
      const users = await Search.searchUserByNameOrEmail(q, filter);

      return res.json(users);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

export default new SearchService();
