
import Airtable from 'airtable';
const TABLE_ID =  import.meta.env.VITE_AIRTABLE_TABLE_ID
const API_KEY =  import.meta.env.VITE_AIRTABLE_API_KEY
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID


type ContactMutation = {
  id: string;
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite?: boolean;
};




const base = new Airtable({ apiKey:API_KEY  }).base(BASE_ID);


////////////////////////////////////////////////////////////////////////////////
// Just a wrapper for the Airtable API
export async function getContacts() {}
 

export async function getContact(id: string) {


  return new Promise((resolve, reject) => {
    base(TABLE_ID).find(id, function (err, record) {
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
      base(TABLE_ID).update(
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
