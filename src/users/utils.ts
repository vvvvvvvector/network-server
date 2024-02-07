import { SelectQueryBuilder } from 'typeorm';

import { User } from './entities/user.entity';

export const parseUserContacts = (user: User) => {
  const { contacts, ...profileAndUsername } = user;

  // eslint-disable-next-line
  const { id, ...rest } = profileAndUsername;

  return contacts.email.isPublic
    ? {
        ...rest,
        contacts: {
          email: contacts.email,
        },
      }
    : {
        ...rest,
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
    .leftJoin('profile.avatar', 'avatar')
    .leftJoin('user.contacts', 'contacts') // user.contacts references contacts property defined in the User entity
    .leftJoin('contacts.email', 'email') // contacts.email references email property defined in the Contacts entity
    .select([
      'user.username',
      'profile.uuid',
      'profile.isActivated',
      'profile.createdAt',
      'profile.avatar',
      'profile.bio',
      'avatar.name',
      'avatar.likes',
      'contacts',
      'email.contact',
      'email.isPublic',
    ]);

  return qb;
};

export const getPublicUserDataQueryBuilder = (qb: SelectQueryBuilder<User>) => {
  qb.leftJoin('user.profile', 'profile') // user.profile references profile property defined in the User entity
    .leftJoin('profile.avatar', 'avatar')
    .leftJoin('user.contacts', 'contacts') // user.contacts references contacts property defined in the User entity
    .leftJoin('contacts.email', 'email') // contacts.email references email property defined in the Contacts entity
    .select([
      'user.id',
      'user.username',
      'profile.isActivated',
      'profile.createdAt',
      'profile.avatar',
      'profile.bio',
      'avatar.name',
      'avatar.likes',
      'contacts',
      'email.contact',
      'email.isPublic',
    ]);

  return qb;
};
