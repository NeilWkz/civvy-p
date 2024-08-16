////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { json } from "@remix-run/node";
import {airtableFetch} from './services/airtable.server.ts'


type ContactMutation = {
  id?: string;
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite?: boolean;
};

export type ContactRecord = ContactMutation & {
  id: string;
  createdAt: string;
};



////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getContacts() {
 

export async function getContact(id: string) {
  const record = await airtableFetch.get(`backend/${id}`);
  
  return record.data.fields
}

export async function updateContact(id: string, updates: ContactMutation) {
  // const contact = await fakeContacts.get(id);
  // if (!contact) {
  //   throw new Error(`No contact found for ${id}`);
  // }
  // await fakeContacts.set(id, { ...contact, ...updates });
  // return contact;
}

export async function deleteContact(id: string) {
   fakeContacts.destroy(id);
}
