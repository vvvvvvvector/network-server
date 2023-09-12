import { User } from './entities/user.entity';

export const parseUserContacts = (user: User) => {
  const { contacts, ...profileAndUsername } = user;

  const { email } = contacts;

  return email.isPublic
    ? {
        ...profileAndUsername,
        contacts: {
          email,
        },
      }
    : {
        ...profileAndUsername,
        contacts: {
          email: {
            isPublic: email.isPublic,
          },
        },
      };
};
