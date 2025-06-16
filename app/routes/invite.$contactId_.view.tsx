import { Form, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/cloudflare";

import { getContact, updateContact } from "../data";
import stringToBool from "../utils/stringToBool";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";


const ADDRESS_1 = import.meta.env.VITE_ADDRESS_1;
const GOOGLEMAPS = import.meta.env.VITE_GOOGLEMAPS;
const POST_CODE = import.meta.env.VITE_POSTCODE;
const WEEKEND_DATE = import.meta.env.VITE_WEEKEND_DATE;
const DATE = import.meta.env.VITE_DATE;


export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  invariant(params.contactId, "No contactId provided");
  const contact = await getContact({
    id: params.contactId,
    apiKey: context.cloudflare.env.AIRTABLE_API_KEY,
    baseID: context.cloudflare.env.AIRTABLE_BASE_ID,
    tableID: context.cloudflare.env.AIRTABLE_TABLE_ID,
  });
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

  const weekender = stringToBool(contact.weekender);


  const inviteTypeHandler = (inviteSize: string) => {
    if (inviteSize === "Family") {
      return "& family";
    } else if (inviteSize === "Plus One") {
      return "+ 1";
    }
    return null;
  };

  return (
    <div id="contact" className="container mx-auto px-12">
      
      <img
        src="/letters.svg"
        alt="letters"
        className="initials"
      />
      <div className="pt-10 md:max-w-md m-auto text-center">
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
          <p>
            For the weekend of <br /> {WEEKEND_DATE}
          </p>
        ) : (
          <>
            <p>On {DATE}</p>
            <p>At 2:00 PM</p>
          </>
        )}
        <p>
          At {ADDRESS_1} <br />
          <a href={GOOGLEMAPS} target="_blank" rel="noreferrer">
            {POST_CODE}
          </a>{" "}
        </p>
        <p className="pt-6 bold italic">Please RSVP by April 1st, 2025</p>

        {weekender ? (
          <p className="text-base pt-6 pb-6">
            Camping is available on the farm, or you can find{" "}
            <a
              href="https://www.google.com/travel/search?q=hotels%20near%20YO17%208EW&g2lb=4965990%2C4969803%2C72277293%2C72302247%2C72317059%2C72406588%2C72414906%2C72421566%2C72471280%2C72472051%2C72481459%2C72485658%2C72499705%2C72560029%2C72573224%2C72614662%2C72616120%2C72619927%2C72628720%2C72647020%2C72648289%2C72658035%2C72686036%2C72760082%2C72803964%2C72808078%2C72832976&hl=en-GB&gl=uk&cs=1&ssta=1&ts=CAESCAoCCAMKAggDGhwSGhIUCgcI6Q8QBxgEEgcI6Q8QBxgGGAIyAggBKgcKBToDR0JQ&qs=CAE4BlpOMkyqAUkQASoKIgZob3RlbHMoADIfEAEiG9g7XxMN2owDuJjqmEbUGXakRe40VkKqooIMuTIYEAIiFGhvdGVscyBuZWFyIHlvMTcgOGV3&ap=aAE&ictx=1&ved=0CAAQ5JsGahcKEwiYi6i2l-aKAxUAAAAAHQAAAAAQCw"
              target="_blank"
              rel="noopener noreferrer"
            >
              other accommodation
            </a>{" "}
            nearby.
          </p>
        ) : null}

        <div className="p-8">
          <Form action="edit">
            <button className="button-primary button-invite" type="submit">
              {contact.hasResponded ? "Edit RSVP" : "RSVP"}
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
