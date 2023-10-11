import { SelectQueryBuilder } from 'typeorm';
import { User } from './entities/user.entity';

export const parseUserContacts = (user: User) => {
  const { contacts, ...profileAndUsername } = user;

  return contacts.email.isPublic
    ? {
        ...profileAndUsername,
        contacts: {
          email: contacts.email,
        },
      }
    : {
        ...profileAndUsername,
        contacts: {
          email: {
            isPublic: contacts.email.isPublic,
          },
        },
      };
};

export const getSignedInUserDataQueryBuilder = (
  qb: SelectQueryBuilder<User>,
) => {
  qb.leftJoin('user.profile', 'profile') // user.profile references profile property defined in the User entity
    .leftJoin('user.contacts', 'contacts') // user.contacts references contacts property defined in the User entity
    .leftJoin('contacts.email', 'email') // contacts.email references email property defined in the Contacts entity
    .select([
      'user.username',
      'profile.uuid',
      'profile.isActivated',
      'profile.createdAt',
      'profile.avatar',
      'contacts',
      'email.contact',
      'email.isPublic',
    ]);

  return qb;
};

export const getPublicUserDataQueryBuilder = (qb: SelectQueryBuilder<User>) => {
  qb.leftJoin('user.profile', 'profile') // user.profile references profile property defined in the User entity
    .leftJoin('user.contacts', 'contacts') // user.contacts references contacts property defined in the User entity
    .leftJoin('contacts.email', 'email') // contacts.email references email property defined in the Contacts entity
    .select([
      'user.username',
      'profile.isActivated',
      'profile.createdAt',
      'profile.avatar',
      'contacts',
      'email.contact',
      'email.isPublic',
    ]);

  return qb;
};
