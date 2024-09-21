
import Airtable from 'airtable';
const AIRTABLE_TABLE_ID = env.AIRTABLE_TABLE_ID || import.meta.env.VITE_AIRTABLE_TABLE_ID
const AIRTABLE_API_KEY = env.AIRTABLE_API_KEY || import.meta.env.VITE_AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = env.AIRTABLE_BASE_ID || import.meta.env.VITE_AIRTABLE_BASE_ID


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
// Just a wrapper for the Airtable API
export async function getContacts() {}
 

export async function getContact(id: string) {


  return new Promise((resolve, reject) => {
    base(AIRTABLE_TABLE_ID).find(id, function (err, record) {
      if (err) {
        console.error(err)
        reject(err)
        return
      }
      resolve(record.fields)
    })
  })  
  
}

export async function updateContact(id: string, updates: ContactMutation) {

   const invite = await getContact(id);
  delete invite.id; // remove the id from the fields object
    const fields = {
      ...invite,
      ...updates,
    };



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
