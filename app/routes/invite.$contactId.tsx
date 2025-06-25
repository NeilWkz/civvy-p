import { Form, useLoaderData, Link } from "@remix-run/react";
import { useState, useMemo } from "react";
import { json } from "@remix-run/cloudflare";
import classnames from "classnames";
import { getContact, updateContact } from "../data";
import stringToBool from "../utils/stringToBool";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { google, outlook, ics } from "calendar-link";

const ADDRESS_1 = import.meta.env.VITE_ADDRESS_1;
const GOOGLEMAPS = import.meta.env.VITE_GOOGLEMAPS;
const POST_CODE = import.meta.env.VITE_POSTCODE;
const weekendStart = import.meta.env.VITE_WEEKEND_START;
const weekendEnd = import.meta.env.VITE_WEEKEND_END;
const dayStart = import.meta.env.VITE_DAY_START;
const dayEnd = import.meta.env.VITE_DAY_END;
const GOOGLE_FORM = import.meta.env.VITE_GOOGLEFORM;
const WHATSAPP_GROUP = import.meta.env.VITE_WHATSAPP_GROUP;
const BABYPHOTOS = import.meta.env.VITE_BABY_PHOTOS;

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

  const eventStarted = useMemo(() => {
    //subtract 1 day from the weekend start date to check if the event has started
    const weekendStartDate = new Date(weekendStart);
    const dayOf = weekendStartDate.setDate(weekendStartDate.getDate() - 2);
    const startDate = new Date(dayOf);

    return startDate.getTime() < Date.now();
  }, []);

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
    setShowCalendar(!showCalendar);
  };

  return (
    <div id="contact" className="container mx-auto max-w-3xl">
      <img src="/letters.svg" alt="letters" className="head-initials" />
      {contact.hasResponded ? (
        <>
          <div className="flex mt-5 justify-center flex-wrap gap-5 pl-5 pr-5">
            <a
              className="button button-secondary inline-flex items-center"
              href={GOOGLE_FORM}
              target="_blank"
              rel="noreferrer"
            >
              <svg
                width="50"
                height="50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-5 -10 110 135"
                className="w-8 mr-2"
              >
                <path d="M83.02 26.469H70.809l-4.86-6.512a4.538 4.538 0 0 0-3.609-1.808H44.41c-1.41 0-2.761.68-3.61 1.808l-4.859 6.512h-3.699v-1.91a4.061 4.061 0 0 0-4.05-4.059H21.46a4.063 4.063 0 0 0-4.059 4.059v1.91h-.422a6.985 6.985 0 0 0-6.98 6.98v36.97a6.985 6.985 0 0 0 6.98 6.98H38.7c4.199 2.809 9.25 4.45 14.68 4.45s10.468-1.641 14.671-4.45h14.97a6.985 6.985 0 0 0 6.98-6.98v-36.97a6.985 6.985 0 0 0-6.98-6.98zm-62.621-1.91c0-.578.48-1.059 1.059-1.059h6.73c.578 0 1.05.48 1.05 1.059v1.91H20.4zm-3.418 49.84a3.99 3.99 0 0 1-3.98-3.98V39.93h18.851a26.29 26.29 0 0 0-4.968 15.422c0 7.47 3.11 14.23 8.101 19.051h-18zm36.398 4.453c-12.961 0-23.5-10.54-23.5-23.5 0-12.961 10.539-23.5 23.5-23.5s23.5 10.539 23.5 23.5c0 12.96-10.551 23.5-23.5 23.5zM87 70.422a3.99 3.99 0 0 1-3.98 3.98H71.77c4.988-4.82 8.109-11.577 8.109-19.05 0-5.75-1.852-11.078-4.969-15.422H87zm0-33.492H72.398c-4.82-4.98-11.57-8.078-19.02-8.078-7.45 0-14.211 3.102-19.031 8.078H12.999v-3.48a3.99 3.99 0 0 1 3.98-3.98h20.462l5.769-7.72c.281-.37.73-.601 1.2-.601h17.93c.468 0 .921.23 1.21.601l5.762 7.72h13.71a3.99 3.99 0 0 1 3.981 3.98v3.48z" />
                <path d="M53.379 39.102c-8.96 0-16.25 7.29-16.25 16.25s7.29 16.25 16.25 16.25 16.25-7.29 16.25-16.25-7.29-16.25-16.25-16.25zm0 29.5c-7.309 0-13.25-5.95-13.25-13.25s5.941-13.25 13.25-13.25 13.25 5.941 13.25 13.25-5.95 13.25-13.25 13.25z" />
                <path d="M46.328 55.352c2.012-3.078 3.969-5.031 7.05-7.05-4.07-2.602-9.64 2.98-7.05 7.05z" />
              </svg>
              Send us Photos
            </a>
                 <a
              className="button button-secondary inline-flex items-center"
              href={WHATSAPP_GROUP}
              target="_blank"
              rel="noreferrer"
            >
             <svg xmlns="http://www.w3.org/2000/svg"                 className="w-5 mr-2"
  viewBox="0 0 30.667 30.667"><path d="M30.667 14.939c0 8.25-6.74 14.938-15.056 14.938a15.1 15.1 0 0 1-7.276-1.857L0 30.667l2.717-8.017a14.787 14.787 0 0 1-2.159-7.712C.559 6.688 7.297 0 15.613 0c8.315.002 15.054 6.689 15.054 14.939zM15.61 2.382c-6.979 0-12.656 5.634-12.656 12.56 0 2.748.896 5.292 2.411 7.362l-1.58 4.663 4.862-1.545c2 1.312 4.393 2.076 6.963 2.076 6.979 0 12.658-5.633 12.658-12.559C28.27 8.016 22.59 2.382 15.61 2.382zm7.604 15.998c-.094-.151-.34-.243-.708-.427-.367-.184-2.184-1.069-2.521-1.189-.34-.123-.586-.185-.832.182-.243.367-.951 1.191-1.168 1.437-.215.245-.43.276-.799.095-.369-.186-1.559-.57-2.969-1.817-1.097-.972-1.838-2.169-2.052-2.536-.217-.366-.022-.564.161-.746.165-.165.369-.428.554-.643.185-.213.246-.364.369-.609.121-.245.06-.458-.031-.643-.092-.184-.829-1.984-1.138-2.717-.307-.732-.614-.611-.83-.611-.215 0-.461-.03-.707-.03s-.646.089-.983.456-1.291 1.252-1.291 3.054c0 1.804 1.321 3.543 1.506 3.787.186.243 2.554 4.062 6.305 5.528 3.753 1.465 3.753.976 4.429.914.678-.062 2.184-.885 2.49-1.739.308-.858.308-1.593.215-1.746z"/></svg>
              Join WhatsApp Group
            </a>
            <a
              className="button button-secondary inline-flex items-center"
              href={GOOGLEMAPS}
              target="_blank"
              rel="noreferrer"
            >
              <svg
                className="w-6 fill-white mr-3"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="-5.0 -10.0 110.0 135.0"
              >
                <path d="m50.012 10.969c1.0469 0.015625 2.0391 0.46875 2.7422 1.2461 3.3164 3.3281 6.6367 6.6523 9.9648 9.9688 8.2656 8.2656 16.535 16.531 24.801 24.797 2.0625 2.0625 2.0586 3.9414-0.019531 6.0195-11.508 11.508-23.02 23.016-34.531 34.523-2.0195 2.0195-3.9258 2.0117-5.957-0.019532-11.531-11.527-23.059-23.055-34.59-34.586-0.9375-0.69141-1.4883-1.7852-1.4844-2.9492s0.5625-2.2578 1.5-2.9453c11.57-11.566 23.137-23.137 34.703-34.707h0.003906c0.72266-0.83594 1.7656-1.3242 2.8672-1.3477zm3.5703 47.652 12.227-12.258-12.25-12.242v8.6836h-1.1172-12.754l-0.003906 0.003906c-1.0938-0.12109-2.1836 0.26172-2.9609 1.0391-0.77734 0.78125-1.1562 1.8711-1.0312 2.9648-0.003906 4.3359-0.007812 8.668 0 13.004v0.85156h7.1484l-0.003906-10.633h10.742z" />
              </svg>
              Directions
            </a>
          </div>
          {!eventStarted && (
            <>
              <div className="flex mt-5 justify-center flex-wrap gap-5 pl-5 pr-5 mb-10">
                <button
                  onClick={calendarHandler}
                  className={classnames({
                    "button button-secondary inline-flex items-center": true,
                    "button-secondary-active": showCalendar,
                  })}
                >
                  <svg
                    className="w-4 h-4 mr-2 fill-orange-700"
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
                {showCalendar ? (
                <div className="calendar-links flex gap-6 flex content-center justify-center">
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
                <Link to="view" className="button button-secondary">
                  View Invite
                </Link>
                <Form action="edit">
                  <button className="button button-secondary" type="submit">
                    {contact.hasResponded ? "Edit RSVP" : "RSVP"}
                  </button>
                </Form>
              </div>
              
            </>
          )}
        </>
      ) : null}

  
      <img src="/letters.svg" alt="letters" className="small-initials" />

      <div className="description-body pl-5 pr-5">
        <p>Hello {contact.guest ? <>{contact.guest}</> : <i>dearie</i>}</p>

        {weekender ? (
          <>
            <p>
              Thank you for your RSVP to our Civil Partnership Party. We
              can&apos;t wait to spend a summer weekend with you in Yorkshire.
            </p>
            <p>
              We will be delighted to welcome you to the grounds of {ADDRESS_1}{" "}
              <br />
              <a href={GOOGLEMAPS} target="_blank" rel="noreferrer">
                {POST_CODE}
              </a>{" "}
              from 5pm on the 4th of July 2025.
            </p>
            <p>
              Saturday evening is catered, we will provide some baked goods on
              Saturday Morning, and we will be barbecuing a breakfast on Sunday
              morning (veggie & vegan options available).
            </p>
            <p>
              We need to make plans for Friday night; Please respond to let us
              know what time you will arrive. There is a small pizza oven on
              site, so for people arriving before 8pm we plan to arrange a
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
              There are shower facilities onsite, but there is also an
              additional outdoor shower, which if you want to use please bring
              swimwear. (Apparently, kids love it in the summer) Scarborough
              Beach is 20mins drive away so it would be a shame to spend a
              weekend on the Yorkshire coast without them in case you fancy a
              Sunday afternoon dip in the sea.
            </p>
            <h4>On the day</h4>
            <p>Dress code: Garden Party</p>
            <p>
              We are hopeful for fine weather and have planned contingencies in
              any event, but we would ask that guests wear appropriate footwear
              for the conditions. The farm&apos;s event field is on sand, so
              conditions should be fair. However, in the event of a rain
              forecast, please don&apos;t ruin your best shoes.
            </p>
            <p>
              We also have some news to share: We welcomed our daughter Marcie
              on May the 8th. She is happy and healthy and we are excited to
              introduce her to you all at the party.
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
              politely request no physical gifts. We are grateful for all we
              have and count ourselves as very lucky just to share this day with
              you all. Please, please don&apos;t feel you need to give us
              anything at all - your company at our celebration is enough.
              However, should you wish to mark the occasion with a gift, we have
              set up{" "}
              <a
                href="https://app.collectionpot.com/pot/3352675"
                target="_blank"
                rel="noopener noreferrer"
              >
                a small collection pot
              </a>
              . Any kind contributions will be gratefully put towards a special
              honeymoon fund, for a trip we hope to take together once our
              little one is a bit older.
            </p>
            <p>We look forward to seeing you then.</p>
            <p>With love,</p>
            <p>Jo & Neil</p>
          </>
        ) : (
          <>
            <p>
              Thank you for your RSVP to our Civil Partnership Party. We&apos;re
              looking forward to celebrating with you.
            </p>

            <p>
              {" "}
              We will be delighted to welcome you to the grounds of {
                ADDRESS_1
              }{" "}
              <br />
              <a href={GOOGLEMAPS} target="_blank" rel="noreferrer">
                {POST_CODE}
              </a>{" "}
              on the 5th of July 2025.
            </p>

            <p>Dress code: Garden Party</p>

            <p>
              We are hopeful for fine weather and have planned contingencies in
              any event, but we would ask that guests wear appropriate footwear
              for the conditions. The farm&apos;s event field is on sand, so
              conditions should be fair. However, in the event of a rain
              forecast, please don&apos;t ruin your best shoes.
            </p>

            <p>
              We also have some news to share: We welcomed our daughter Marcie
              on May the 8th. She is a happy and healthy and we are excited to
              introduce her to you all at the party.
            </p>
            <p>
              We&apos;re so happy that she will be joining us to celebrate with
              you.
            </p>

            <p>
              Please arrive at 2 pm on the day of the party. We plan for a
              ceremony followed by a drinks reception, with Dinner served from
              6.30pm.
            </p>
            <p>
              The party will finish at 11.30 pm with carriages by midnight, as
              the venue is in a rural setting, we have been advised that you
              should make arrangements to book a taxi in advance of the event.{" "}
            </p>

            <p>
              We are fortunate enough to already have a home that is full of
              things we love (soon to be even fuller with baby things!), so we
              politely request no physical gifts. We are grateful for all we
              have and count ourselves as very lucky just to share this day with
              you all. Please, please don&apos;t feel you need to give us
              anything at all - your company at our celebration is enough.
              However, should you wish to mark the occasion with a gift, we have
              set up{" "}
              <a
                href="https://app.collectionpot.com/pot/3352675"
                target="_blank"
                rel="noopener noreferrer"
              >
                a small collection pot
              </a>
              . Any kind contributions will be gratefully put towards a special
              honeymoon fund, for a trip we hope to take together once our
              little one is a bit older.
            </p>

            <p>We look forward to seeing you then.</p>

            <p>With love,</p>

            <p>Jo & Neil</p>
          </>
        )}
        
      </div>
          <div className="question-wrap mx-8 mt-2">
        <details className="question py-4 border-b border-grey-lighter">
          <summary className="flex items-center font-bold">
            Menu
            <button className="ml-auto">
              <svg
                className="fill-current opacity-75 w-4 h-4 -mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
              </svg>
            </button>
          </summary>

          <div className="mt-4 leading-normal text-md ">
            <h6>Canapes:</h6>
            <ul>
              <li>
                <strong>Beef Shin Croquettes</strong>:<br />
                Confit beef shin, wild mushroom dexelle & black garlic aioli
              </li>
              <li>
                <strong>Buttermilk Chicken</strong>:<br />
                Crispy buttermilk chicken & Creole mayo
              </li>
              <li>
                <strong>Mac & Cheese Bites with truffle mayo</strong>:<br />
                Three cheese mac & cheese bites with truffle mayo
              </li>
              <li>
                <strong>Truffle Arancini with marinara sauce</strong>:<br />
                Truffle and wild mushroom arancini balls & marinara sauce
              </li>
            </ul>

            <h6 className="mt-4">Omnivore Sharing Starters:</h6>
            <ul>
              <li>
                <strong>Seafood Board</strong>:<br />
                Potted Whitby crab, prawn & crayfish, fried calamari, fennel
                remoulade, pickled cucumber salad, lemon aioli, artisan bread
              </li>
            </ul>

            <h6 className="mt-4">Vegetarian Starter:</h6>
            <ul>
              <li>
                <strong>Eggs & Soldiers</strong>:<br />
                Hen's egg & brioche soldiers, charred asparagus, truffled
                hollandaise
              </li>
            </ul>

            <h6 className="mt-4">Vegan Starter:</h6>
            <ul>
              <li>
                <strong>Charred Celeriac</strong>:<br />
                Ember roast celeriac, truffle aioli, chimichurri (VE)
              </li>
            </ul>

            <h6 className="mt-4">Omnivore Sharing Main:</h6>
            <ul>
              <li>
                <strong>Feasting Board</strong>:<br />
                Rosemary & garlic porchetta pork belly, chermoula marinated
                chicken, wild garlic flatbread
              </li>
            </ul>

            <h6 className="mt-4">Vegetarian Sharing Main:</h6>
            <ul>
              <li>
                <strong>Feasting Board</strong>:<br />
                Cauliflower shawarma with pomegranate, tahini & pine nuts,
                grilled marinated courgettes, charred halloumi, chickpea, hummus
                & dukkah, coriander flatbread
              </li>
            </ul>

            <h6 className="mt-4">Sharing Sides:</h6>
            <ul>
              <li>
                <strong>Blackened Hispi Cabbage</strong>:<br />
                Wild rice & tahini yogurt
              </li>
              <li>
                <strong>Charred Broccoli & Courgette Salad</strong>:<br />
                Charred with lemon, feta, pumpkin seeds
              </li>
            </ul>

            <h6 className="mt-4">Kids Menu:</h6>
            <ul>
              <li>
                <strong>Starter: Mac & Cheese</strong>
              </li>
              <li>
                <strong>Omni Main: Happy Hotdogs</strong>:<br />
                Yorkshire pork sausage in a hotdog roll with ketchup
              </li>
              <li>
                <strong>Veggie Main: Hidden Veg Pasta</strong>:<br />
                Fusilli pasta with creamy tomato sauce and 'hidden veggies'
              </li>
            </ul>
          </div>
        </details>
        <details className="question py-4 border-b border-grey-lighter">
          <summary className="flex items-center font-bold">
            Local Taxi Companies
            <button className="ml-auto">
              <svg
                className="fill-current opacity-75 w-4 h-4 -mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
              </svg>
            </button>
          </summary>

          <div className="mt-4 leading-normal text-md ">
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
                Boro Cars Scarborough:{" "}
                <a href="tel:01723361111">01723 361111</a>
              </li>
              <li>
                Nippy Taxis Scarborough:{" "}
                <a href="tel:01723377377">01723377377</a>
              </li>
              <li>
                Station Taxis Scarborough:{" "}
                <a href="tel:01723366366">01723366366</a>
              </li>
            </ul>
          </div>
        </details>
          <details className="question py-4 border-b border-grey-lighter">
          <summary className="flex items-center font-bold">
            Baby Photos
            <button className="ml-auto">
              <svg
                className="fill-current opacity-75 w-4 h-4 -mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
              </svg>
            </button>
          </summary>

          <div className="mt-4 leading-normal text-md ">
           <a href={BABYPHOTOS} target="_blank" rel="noopener noreferrer">Some Pics of Marcie</a>
          </div>
        </details>
      </div>
       <img src="/letters.svg" alt="letters" className="head-initials" />
    </div>
  );
}
