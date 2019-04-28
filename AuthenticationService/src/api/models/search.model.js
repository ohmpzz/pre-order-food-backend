import { User } from './line.model';

class SearchModel {
  searchUserByNameOrEmail(q, { limit }) {
    return User.find({
      $text: {
        $search: q,
      },
    })
      .limit(limit)
      .select(
        `
      name picture email uid phoneNumber
    `
      )
      .then(p => p);
  }
}

export default new SearchModel();
