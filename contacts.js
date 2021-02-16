import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const contactsPath = path.resolve('db/contacts.json');

async function parseContacts() {
  try {
    const result = await fs.readFile(contactsPath, 'utf8');
    const contacts = JSON.parse(result);
    return contacts;
  } catch (error) {
    return console.error(error.message);
  }
}

export async function listContacts() {
  try {
    const contacts = await parseContacts();
    console.table(contacts);
  } catch (error) {
    return console.error(error.message);
  }
}

export async function getContactById(contactId) {
  try {
    const contacts = await parseContacts();
    const requiredContact = contacts.filter(({ id }) => id === contactId);
    console.table(requiredContact);
  } catch (error) {
    return console.error(error.message);
  }
}

export async function removeContact(contactId) {
  try {
    const contacts = await parseContacts();

    if (contacts.find(contact => contact.id === contactId)) {
      const updatedContacts = contacts.filter(
        contact => contact.id !== contactId,
      );
      await fs.writeFile(contactsPath, JSON.stringify(updatedContacts));
      console.log(`Contact (id ${contactId}) has been removed`);

      listContacts();
      return;
    }
    listContacts();
  } catch (error) {
    return console.error(error.message);
  }
}

export async function addContact(name, email, phone) {
  try {
    const contacts = await parseContacts();
    const newContact = { id: uuidv4(), name, email, phone };
    const updatedContacts = [...contacts, newContact];

    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts), 'utf8');
    console.log(`Yay! Adding contact ${name} complete`);
    console.table(updatedContacts);
  } catch (error) {
    return console.error(error.message);
  }
}
