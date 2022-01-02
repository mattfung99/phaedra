import { Knex } from 'config/mysql';
import { User } from 'db/models/user.model';
import { TABLE_USER } from 'db/models/tables.model';

const findUser = async (columnLabel: string, columnKey: string | number): Promise<User> => {
  return await Knex(TABLE_USER).select('*').where(columnLabel, columnKey).first();
};

export default {
  findUser
};
