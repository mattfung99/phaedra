import { Knex } from 'config/mysql';
import { User } from 'db/models/user.model';
import { AuthorName } from 'db/models/userInfo.model';
import { TABLE_USER } from 'db/models/tables.model';
import { TABLE_USER_INFO } from 'db/models/tables.model';

const findUser = async (columnLabel: string, columnKey: string | number): Promise<User> => {
  return await Knex(TABLE_USER).select('*').where(columnLabel, columnKey).first();
};

const findAuthor = async (columnLabel: string, columnKey: string | number): Promise<AuthorName> => {
  return await Knex(TABLE_USER_INFO).select('first_name', 'last_name').where(columnLabel, columnKey).first();
};

export default {
  findUser,
  findAuthor
};
