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
