import Airtable from "airtable";
import {airtableFetch} from "./services/airtable.server";

type InviteMutation = {
  rsvp?: string;
  email?: string;
  phone?: string;
  dietary?: string;
  children?: string;
  numChildren?: string;
  planOnCamping?: string;
  wantGlamping?: string;
  notes?: string;
};

const initialiseBase = ({ apiKey, baseID }) => {
  return new Airtable({ apiKey }).base(baseID);
};

////////////////////////////////////////////////////////////////////////////////
// Just a wrapper for the Airtable API

type GetContactArgs = {
  id: string;
  apiKey?: string;
  baseID?: string;
};

export async function getContact(props: GetContactArgs) {
  console.log('getContact', props)
const {
  id,
  apiKey,
  baseID,
  tableID,
} = props

  const base = airtableFetch({ apiKey, baseID });

const record = await base.get(`${tableID}/${id}`);
  
return record.data.fields
  // const base = initialiseBase({ apiKey, baseID });

  // return new Promise((resolve, reject) => {
  //   base(tableID).find(id, function (err, record) {
  //     if (err) {
  //       console.error(err);
  //       reject(err);
  //       return;
  //     }
  //     resolve(record.fields);
  //   });
  // });
}

type UpdateContactArgs = {
  id: string;
  updates: InviteMutation;
  apiKey?: string;
  baseID?: string;
};

export async function updateContact(props: UpdateContactArgs) {
console.log('updateContact', props)
 const {
    id,
    fields,
    apiKey,
    baseID,
    tableID,
  } = props


  const base = airtableFetch({ apiKey, baseID });

   await base.patch(`${tableID}/${id}`, {fields}) .catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  });


  
  // const base = initialiseBase({ apiKey, baseID });

  // const invite = await getContact({id, apiKey, baseID, tableID});
  // delete invite.id; // remove the id from the fields object
  // const fields = {
  //   ...invite,
  //   ...updates,
  // };

  // new Promise((resolve, reject) => {
  //   base(tableID).update(
  //     [
  //       {
  //         id,
  //         fields,
  //       },
  //     ],
  //     function (err, updatedRecord) {
  //       if (err) {
  //         console.error(err);
  //         reject(err);
  //         return;
  //       }

  //       console.log("Updated record", updatedRecord);

  //       resolve(updatedRecord);
  //     }
  //   );
  // });
}


export async function deleteContact({ id, apiKey, baseID, tableID }) {
  const base = initialiseBase({ apiKey, baseID });

  return new Promise((resolve, reject) => {
    base(tableID).destroy(id, function (err, deletedRecord) {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }

      resolve(deletedRecord);
    });
  });
}