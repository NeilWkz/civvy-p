import { Form, useLoaderData } from "@remix-run/react";

import { json } from "@remix-run/node";

import { getContact, updateContact } from "../data";
import {stringToBool} from "../utils";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

const ADDRESS_1 = import.meta.env.VITE_ADDRESS_1
const GOOGLEMAPS = import.meta.env.VITE_GOOGLEMAPS
const POST_CODE = import.meta.env.VITE_POSTCODE
const WEEKEND_DATE = import.meta.env.VITE_WEEKEND_DATE
const DATE = import.meta.env.VITE_DATE

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "No contactId provided");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, "No contactId provided");
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
};

export default function Contact() {
  const { contact } = useLoaderData<typeof loader>();

  console.log(contact);

  const weekender = stringToBool(contact.weekender);


  const inviteTypeHandler = (inviteSize: string) => {
    if (inviteSize === 'Family') {
      return "& family";
    } else if (inviteSize === 'Plus One') {
      return "+ 1";
    }
    return null
  }

  return (
    <div id="contact" className="container mx-auto px-12">
      <div className="pt-10 text-center">
        <h5>Dear</h5>
        <h1>{contact.guest ? <>{contact.guest}</> : <i>No Name</i>}</h1>
        {inviteTypeHandler(contact.inviteSize)}
        <p className="pt-6">
          We cordially invite you to celebrate the Civil Partnership of
        </p>
        <br />
        <div className="pt-1 pb-8">
          {" "}
          <strong className="spouse">Joanna Quinn</strong>
          <br /> & <br /> <strong className="spouse">Neil Ross</strong>
        </div>
        {weekender ? (
          <p>For the weekend of <br /> {WEEKEND_DATE}</p>
          
        ) : (
          <>
            <p>On {DATE}</p>
            <p>At 2:00 PM</p>
          </>
        )}
        <p>At {ADDRESS_1} <br /><a href={GOOGLEMAPS} target="_blank" rel="noreferrer">{POST_CODE}</a> </p>

        <div className="p-8">
          <Form action="edit">
            <button className="button-primary button-invite" type="submit">
              RSVP
            </button>
          </Form>

          <Form
            className="pt-12"
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you are unable to attend, and you would like us to delete your invite information, and not contact you again regarding this event."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button className="button-link" type="submit">
              delete invite
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

