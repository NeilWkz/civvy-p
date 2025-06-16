import { Form, useLoaderData } from "@remix-run/react";
import { useState, useMemo } from "react";
import { json } from "@remix-run/cloudflare";

import { getContact, updateContact } from "../data";
import stringToBool from "../utils/stringToBool";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import classNames from "classnames";
import { google, outlook, ics } from "calendar-link";

const ADDRESS_1 = import.meta.env.VITE_ADDRESS_1;
const GOOGLEMAPS = import.meta.env.VITE_GOOGLEMAPS;
const POST_CODE = import.meta.env.VITE_POSTCODE;
const WEEKEND_DATE = import.meta.env.VITE_WEEKEND_DATE;
const DATE = import.meta.env.VITE_DATE;
const weekendStart = import.meta.env.VITE_WEEKEND_START;
const weekendEnd = import.meta.env.VITE_WEEKEND_END;
const dayStart = import.meta.env.VITE_DAY_START;
const dayEnd = import.meta.env.VITE_DAY_END;

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
  const [showCalendar, setShowCalendar] = useState(false);

  const weekender = stringToBool(contact.weekender);

  const eventDetails = useMemo(() => {
    return {
      title: "Jo & Neil's Civil Partnership",
      location: `${ADDRESS_1}, ${POST_CODE}`,
      description: `To access your personal invite page visit: https://jo-and-neil-get-hitched.co.uk/invite/${contact.id}`,
      start: weekender ? weekendStart : dayStart,
      end: weekender ? weekendEnd : dayEnd,
    };
  }, [weekender, contact.id]);

  const googleUrl = useMemo(() => google(eventDetails), [eventDetails]);
  const outlookUrl = useMemo(() => outlook(eventDetails), [eventDetails]);
  const icsUrl = useMemo(() => ics(eventDetails), [eventDetails]);

  const calendarHandler = (event: string) => {
    event.preventDefault();
    setShowCalendar(true);
  };

  const inviteTypeHandler = (inviteSize: string) => {
    if (inviteSize === "Family") {
      return "& family";
    } else if (inviteSize === "Plus One") {
      return "+ 1";
    }
    return null;
  };

  return (
    <div id="contact" className="container mx-auto max-w-3xl">
      {contact.hasResponded ? (
        <>
          <div className="pt-10 flex mt-5 justify-between">
            <Form action="edit">
              <button className="button-secondary mr-3 text-sm" type="submit">
                {contact.hasResponded ? "Edit RSVP" : "RSVP"}
              </button>
            </Form>
          </div>
          <div className="flex mt-5 justify-center">
            <button
              onClick={calendarHandler}
              className="mr-2 button-secondary inline-flex items-center"
            >
              <svg
                className="w-4 h-4 mr-3 fill-orange-700"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 610.398 610.398"
                xmlSpace="preserve"
              >
                <path d="M159.567 0h-15.329c-1.956 0-3.811.411-5.608.995-8.979 2.912-15.616 12.498-15.616 23.997v51.613c0 2.611.435 5.078 1.066 7.44 2.702 10.146 10.653 17.552 20.158 17.552h15.329c11.724 0 21.224-11.188 21.224-24.992V24.992c0-13.804-9.5-24.992-21.224-24.992zm301.721 0h-15.329c-11.724 0-21.224 11.188-21.224 24.992v51.613c0 13.804 9.5 24.992 21.224 24.992h15.329c11.724 0 21.224-11.188 21.224-24.992V24.992C482.507 11.188 473.007 0 461.288 0z" />
                <path d="M539.586 62.553h-37.954v14.052c0 24.327-18.102 44.117-40.349 44.117h-15.329c-22.247 0-40.349-19.79-40.349-44.117V62.553H199.916v14.052c0 24.327-18.102 44.117-40.349 44.117h-15.329c-22.248 0-40.349-19.79-40.349-44.117V62.553H70.818c-21.066 0-38.15 16.017-38.15 35.764v476.318c0 19.784 17.083 35.764 38.15 35.764h468.763c21.085 0 38.149-15.984 38.149-35.764V98.322c.005-19.747-17.059-35.769-38.144-35.769zM527.757 557.9l-446.502-.172V173.717h446.502V557.9z" />
                <path d="M353.017 266.258h117.428c10.193 0 18.437-10.179 18.437-22.759s-8.248-22.759-18.437-22.759H353.017c-10.193 0-18.437 10.179-18.437 22.759 0 12.575 8.243 22.759 18.437 22.759zm0 82.209h117.428c10.193 0 18.437-10.179 18.437-22.759 0-12.579-8.248-22.758-18.437-22.758H353.017c-10.193 0-18.437 10.179-18.437 22.758 0 12.58 8.243 22.759 18.437 22.759zm0 82.209h117.428c10.193 0 18.437-10.18 18.437-22.759s-8.248-22.759-18.437-22.759H353.017c-10.193 0-18.437 10.18-18.437 22.759s8.243 22.759 18.437 22.759zm0 82.214h117.428c10.193 0 18.437-10.18 18.437-22.759 0-12.58-8.248-22.759-18.437-22.759H353.017c-10.193 0-18.437 10.179-18.437 22.759 0 12.579 8.243 22.759 18.437 22.759zM145.032 266.258H262.46c10.193 0 18.436-10.179 18.436-22.759s-8.248-22.759-18.436-22.759H145.032c-10.194 0-18.437 10.179-18.437 22.759.001 12.575 8.243 22.759 18.437 22.759zm0 82.209H262.46c10.193 0 18.436-10.179 18.436-22.759 0-12.579-8.248-22.758-18.436-22.758H145.032c-10.194 0-18.437 10.179-18.437 22.758.001 12.58 8.243 22.759 18.437 22.759zm0 82.209H262.46c10.193 0 18.436-10.18 18.436-22.759s-8.248-22.759-18.436-22.759H145.032c-10.194 0-18.437 10.18-18.437 22.759s8.243 22.759 18.437 22.759zm0 82.214H262.46c10.193 0 18.436-10.18 18.436-22.759 0-12.58-8.248-22.759-18.436-22.759H145.032c-10.194 0-18.437 10.179-18.437 22.759.001 12.579 8.243 22.759 18.437 22.759z" />
              </svg>
              Add to calendar
            </button>
            <a
              className="ml-5 button-primary inline-flex items-center"
              href={GOOGLEMAPS}
              target="_blank"
              rel="noreferrer"
            >
              <svg
                className="w-5 mr-2 fill-white"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="-5.0 -10.0 110.0 135.0"
              >
                <path d="m50.012 10.969c1.0469 0.015625 2.0391 0.46875 2.7422 1.2461 3.3164 3.3281 6.6367 6.6523 9.9648 9.9688 8.2656 8.2656 16.535 16.531 24.801 24.797 2.0625 2.0625 2.0586 3.9414-0.019531 6.0195-11.508 11.508-23.02 23.016-34.531 34.523-2.0195 2.0195-3.9258 2.0117-5.957-0.019532-11.531-11.527-23.059-23.055-34.59-34.586-0.9375-0.69141-1.4883-1.7852-1.4844-2.9492s0.5625-2.2578 1.5-2.9453c11.57-11.566 23.137-23.137 34.703-34.707h0.003906c0.72266-0.83594 1.7656-1.3242 2.8672-1.3477zm3.5703 47.652 12.227-12.258-12.25-12.242v8.6836h-1.1172-12.754l-0.003906 0.003906c-1.0938-0.12109-2.1836 0.26172-2.9609 1.0391-0.77734 0.78125-1.1562 1.8711-1.0312 2.9648-0.003906 4.3359-0.007812 8.668 0 13.004v0.85156h7.1484l-0.003906-10.633h10.742z" />
              </svg>
              Directions
            </a>
          </div>
          {showCalendar ? (
            <div className="calendar-links flex gap-6 flex content-center mt-10 justify-center">
              <a href={googleUrl} className="button-link">
                Google
              </a>
              <a href={outlookUrl} className="button-link">
                Outlook
              </a>
              <a href={icsUrl} className="button-link">
                iPhone
              </a>
            </div>
          ) : null}
        </>
      ) : null}
      <img src="/letters.svg" alt="letters" className="small-initials" />

      <div className="description-body">

      {weekender ? (
        <>
          <p>Hello {contact.guest ? <>{contact.guest}</> : <i>dearie</i>}</p>
          <p>
            Thank you for your RSVP to our Civil Partnership Party. We
            can&apos;t wait to spend a summer weekend with you in Yorkshire.
          </p>
          <p>
            We will be delighted to welcome you to the grounds of {ADDRESS_1} <br />
          <a href={GOOGLEMAPS} target="_blank" rel="noreferrer">
            {POST_CODE}
          </a> from 5pm on the 4th of July 2025.
          </p>
          <p>
            Saturday evening is catered, we will provide some baked goods on
            Saturday Morning, and we will be barbecuing a breakfast on Sunday
            morning (veggie & vegan options available).
          </p>
          <p>
            We need to make plans for Friday night; Please respond to let us
            know what time you will arrive. There is a small pizza oven on site,
            so for people arriving before 8pm we plan to arrange a
            make-your-own-pizza party. If you or your party have any special
            dietary requirements outside of the catered meal, please make your
            own provisions.
          </p>
          <p>
            We plan to have some drinks on the Friday night. Drinks for Friday
            evening are BYOB.
          </p>
          <p>
            The venue is licensed on Saturday so only wine served by us or
            alcohol sold by the bar company is permitted.
          </p>
          <h4>Things to pack:</h4>
          <ul className="list-disc pl-5">
            <li>Swimwear</li>

            <li>Camping Crockery & Cutlery</li>

            <li>Picnic blanket or chair</li>

            <li>Appropriate footwear</li>

            <li>Sunscreen</li>
          </ul>
          <p>
            There are shower facilities onsite, but there is also an additional
            outdoor shower, which if you want to use please bring swimwear.
            (Apparently, kids love it in the summer) Scarborough Beach is 20mins
            drive away so it would be a shame to spend a weekend on the
            Yorkshire coast without them in case you fancy a Sunday afternoon
            dip in the sea.
          </p>
          <h4>On the day</h4>
          <p>Dress code: Garden Party</p>
          <p>
            We are hopeful for fine weather and have planned contingencies in
            any event, but we would ask that guests wear appropriate footwear
            for the conditions. The farm&apos;s event field is on sand, so conditions
            should be fair. However, in the event of a rain forecast, please
            don&apos;t ruin your best shoes.
          </p>
          <p>
            We also have some news to share: we&apos;re expecting a baby on 15th May.
            We&apos;re pleased to start this new chapter, and all being well,
            we&apos;ll introduce our little one to you all.
          </p>
          <p>
            Other guests will arrive at 2 pm on the day of the party. We will
            hold a ceremony followed by a drinks reception, with Dinner served
            from 6.30pm.
          </p>
          <p>
            The reception will finish at 11.30 pm with the other guests
            departing by midnight.
          </p>
          <p>
            We are fortunate enough to already have a home that is full of
            things we love (soon to be even fuller with baby things!), so we
            politely request no physical gifts. We are grateful for all we have
            and count ourselves as very lucky just to share this day with you
            all. Please, please don&apos;t feel you need to give us anything at all -
            your company at our celebration is enough. However, should you wish
            to mark the occasion with a gift, we have set up a small collection
            pot. Any kind contributions will be gratefully put towards a special
            honeymoon fund, for a trip we hope to take together once our little
            one is a bit older.
          </p>
          <p>We look forward to seeing you then.</p>
          <p>With love,</p>
          <p>Jo & Neil</p>
          <h3>Local taxi companies:</h3>
          <p>
            It is best to make a prior reservation with a company should you
            need a cab
          </p>
          <ul>
            <li>
              Malton Taxis: <a href="tel:01653475475">01653475475</a>
            </li>
            <li>
              K Cars Malton: <a href="tel:01653919500">01653919500</a>
            </li>
            <li>
              Take Me Taxis Malton: <a href="tel:01653696969">01653696969</a>
            </li>
            <li>
              Boro Cars Scarborough: <a href="tel:01723361111">01723 361111</a>
            </li>
            <li>
              Nippy Taxis Scarborough: <a href="tel:01723377377">01723377377</a>
            </li>
            <li>
              Station Taxis Scarborough:{" "}
              <a href="tel:01723366366">01723366366</a>
            </li>
          </ul>
        </>
      ) : (
        <>Day guests</>
      )}
      </div>
    </div>
  );
}
