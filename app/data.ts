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

////////////////////////////////////////////////////////////////////////////////
// Just a wrapper for the Airtable API

type GetContactArgs = {
  id: string;
  apiKey?: string;
  baseID?: string;
};

export async function getContact( {
  id,
  apiKey,
  baseID,
  tableID,
}: GetContactArgs) {

  const base = airtableFetch({ apiKey, baseID });

const record = await base.get(`${tableID}/${id}`);
  
return record.data.fields

}

type UpdateContactArgs = {
  id: string;
  updates: InviteMutation;
  apiKey?: string;
  baseID?: string;
};

export async function updateContact({
  id,
  fields,
  apiKey,
  baseID,
  tableID,
}: UpdateContactArgs) {


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

}


export async function deleteContact({ id, apiKey, baseID, tableID }) {
  const base = airtableFetch({ apiKey, baseID });

  await base.delete(`${tableID}/${id}`);
}