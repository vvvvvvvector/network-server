import { User } from './entities/user.entity';

export const parseContacts = (user: User) => {
  const { contacts, ...profileAndUsername } = user;

  const { emailContact } = contacts;

  return emailContact.isPublic
    ? {
        ...profileAndUsername,
        contacts: {
          emailContact,
        },
      }
    : {
        ...profileAndUsername,
        contacts: { emailContact: { isPublic: emailContact.isPublic } },
      };
};
