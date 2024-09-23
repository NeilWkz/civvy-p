import Airtable from "airtable";

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

export async function getContact({
  id,
  apiKey,
  baseID,
  tableID,
}: GetContactArgs) {

  const base = initialiseBase({ apiKey, baseID });

  return new Promise((resolve, reject) => {
    base(tableID).find(id, function (err, record) {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      resolve(record.fields);
    });
  });
}

type UpdateContactArgs = {
  id: string;
  updates: InviteMutation;
  apiKey?: string;
  baseID?: string;
};

export async function updateContact({
  id,
  updates,
  apiKey,
  baseID,
  tableID,
}: UpdateContactArgs) {
  const base = initialiseBase({ apiKey, baseID });

  const invite = await getContact({id, apiKey, baseID, tableID});
  delete invite.id; // remove the id from the fields object
  const fields = {
    ...invite,
    ...updates,
  };

  new Promise((resolve, reject) => {
    base(tableID).update(
      [
        {
          id,
          fields,
        },
      ],
      function (err, updatedRecord) {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        resolve(updatedRecord);
      }
    );
  });
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