// @ts-check
import { Schema as db } from '../api/models/schemas';
import axios from 'axios';

/**
 * Middleware
 */
export class CanManageGroupProduct {
  /**
   * Who can create product item
   * @param {Array} allowedRoles
   * @returns promise
   */
  canCreate(allowedRoles = ['user']) {
    return async (req, res, next) => {
      try {
        const authorized = await this.checkAuthorization(
          req.user,
          allowedRoles
        );
        if (!authorized) {
          return res
            .status(401)
            .json({ code: 'Unauthorized', msg: 'Denied permissions' });
        }

        const memberOfGroup = await this.checkUserExist(
          req.user.sub,
          req.params.groupId
        );

        if (memberOfGroup.found) {
          return next();
        }

        return res
          .status(401)
          .json({ code: 'Unauthorized', msg: 'Denied permissions' });
      } catch (error) {
        return res.status(500).json({ msg: error });
      }
    };
  }

  /**
   * Verify owner product item
   */
  canUpdateAndDelete() {
    return async (req, res, next) => {
      const productId = req.params.productId || req.body.productId;
      const product = await db.Product.findById(productId).select('ownerId');
      if (product.ownerId == req.user.sub) {
        return next();
      }

      return res
        .status(401)
        .json({ code: 'Unauthorized', msg: 'Denied permissions' });
    };
  }

  checkUserExist(userId, groupId) {
    return axios({
      url: `${
        process.env.COMMU_SERVICE_URI
      }/inter-service/groups/check/${groupId}`,
      params: { user: userId },
      method: 'get',
      headers: { 'Content-type': 'application/json' },
    }).then(res => res.data);
  }

  checkAuthorization(user, allowedRoles) {
    return new Promise((resolve, reject) => {
      if (!user) {
        return resolve(false);
      }

      for (const role of allowedRoles) {
        if (user.roles[role]) {
          return resolve(true);
        }
      }

      return resolve(false);
    });
  }
}

export default new CanManageGroupProduct();
