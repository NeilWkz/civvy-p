////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////
import {airtableFetch} from './services/airtable.server';
import Airtable from 'airtable';
const AIRTABLE_TABLE_ID = import.meta.env.VITE_AIRTABLE_TABLE_ID
const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID


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

const base = new Airtable({ apiKey:AIRTABLE_API_KEY  }).base(AIRTABLE_BASE_ID);


////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getContacts() {}
 

export async function getContact(id: string) {
  const invite = await airtableFetch.get(id);

  if (!invite) {
    throw new Error(`No invite found for ${id}`);
  }
  
  return invite.data.fields
}

export async function updateContact(id: string, updates: ContactMutation) {

   const invite = await getContact(id);
  delete invite.id; // remove the id from the fields object
    const fields = {
      ...invite,
      ...updates,
    };


    console.log(invite)


  new Promise((resolve, reject) => {
      base(AIRTABLE_TABLE_ID).update(
        [
          {
            id,
            fields
          }
        ],
        function (err, updatedRecord) {
          if (err) {
            console.error(err)
             reject(err)
            return
          }
         
            resolve(updatedRecord)
         
        }
      )
    })

  
}

export async function deleteContact(id: string) {
   fakeContacts.destroy(id);
}
