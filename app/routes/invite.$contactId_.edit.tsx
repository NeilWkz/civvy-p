import type {
  ActionsFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";
import stringToBool from "../utils/stringToBool";
import { getContact, updateContact } from "../data";
import RadioPair from "../components/RadioPair";
import confetti from "canvas-confetti";

export const action = async ({
  params,
  context,
  request,
}: ActionsFunctionArgs) => {
  invariant(params.contactId, "No contactId provided");

  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact({
    id: params.contactId,
    fields: { ...updates, hasResponded: true },
    apiKey: context.cloudflare.env.AIRTABLE_API_KEY,
    baseID: context.cloudflare.env.AIRTABLE_BASE_ID,
    tableID: context.cloudflare.env.AIRTABLE_TABLE_ID,
  });
  return redirect(`/invite/${params.contactId}`);
};

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
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

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const weekender = stringToBool(contact.weekender);

  // conferrt when the Select RSVP is changed to yes
  const selectChangeHandler = (event) => {
    if (event.target.value === "yes") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.4 },
        disableForReducedMotion: true,
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 edit-page">
      <h5 className="mb-12 text-center">{weekender ?<>If you can join us for the weekend, please complete the form below.</> :<>If you can join us on the day,<br/> please complete the form below.</> }</h5>
      <div className="mx-auto max-w-2xl">
        <Form key={contact.id} id="contact-form" method="post">
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="sm:col-span-3">
                <label
                  htmlFor="rsvp"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  RSVP
                </label>
                <div className="mt-2">
                  <select
                    id="rsvp"
                    name="rsvp"
                    className="block w-full rounded-md border-0 py-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-yellow-700 sm:text-sm sm:leading-6"
                    defaultValue={contact.rsvp}
                    onChange={selectChangeHandler}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email Address
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-700">
                      <input
                        id="email"
                        name="email"
                        placeholder="Email address"
                        defaultValue={contact.email}
                        autoComplete="email"
                        className="block flex-1 border-0 bg-transparent py-4 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 ">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Phone Number
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-700">
                      <input
                        defaultValue={contact.phone}
                        id="phone"
                        name="phone"
                        placeholder="Phone number"
                        autoComplete="tel"
                        className="block flex-1 border-0 bg-transparent py-4 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full mt-10">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Dietary Requirements
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="dietary"
                      name="dietary"
                      defaultValue={contact.dietary}
                      rows={3}
                      className="block w-full rounded-md border-0 py-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-700 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              {contact.inviteSize === "Family" && (
                <>
                  <fieldset className="mt-10">
                    <RadioPair
                      legend="Are you bringing children?"
                      name="children"
                      defaultChecked={contact.children}
                    />
                  </fieldset>

                  <div className="mt-10">
                    <label
                      htmlFor="numChildren"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      How many children attending that require a meal?
                    </label>
                    <div className="mt-2">
                      <select
                        id="numChildren"
                        name="numChildren"
                        defaultValue={contact.numChildren}
                        className="block w-full rounded-md border-0 py-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-yellow-700 sm:text-sm sm:leading-6"
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {weekender === true && (
                // Are you planning on camping radio
              
                <>
                <p className="mt-10 text-lg">We&apos;ve got the farm for the whole weekend, so if you&apos;re up for it, feel free to camp on the Friday & Saturday night.</p>
                <p className="mt-2 text-lg">We&apos;re planning a pizza party & open mic on the Friday, with a Breakfast BBQ on Sunday. We&apos;d love you to join us.</p>
                  <div className="mt-10 grid grid-cols-1">
                    <fieldset>
                      <RadioPair
                        legend="Are you planning on camping?"
                        name="planOnCamping"
                        defaultChecked={contact.planOnCamping}
                      />
                    </fieldset>
                  </div>
                  <div className="mt-10 grid grid-cols-1">
                    <fieldset>
                      <RadioPair
                        legend="Can't make the whole weekend? Can you only attend on the Saturday?"
                        name="onlyDay"
                        defaultChecked={contact.onlyDay}
                      />
                    </fieldset>
                  </div>
                </>
              )}

              <div className="col-span-full mt-10">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Notes
                </label>
                <div className="mt-2">
                  <textarea
                    id="notes"
                    defaultValue={contact.notes}
                    name="notes"
                    rows={6}
                    className="block w-full rounded-md border-0 py-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-700 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="mt-10 flex justify-end lg:ml-4 gap-4">
                <span className="ml-3 sm:block">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-4 py-4 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                </span>

                <span>
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md bg-yellow-700 px-4 py-4 text-sm font-semibold text-white shadow-sm hover:bg-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-700"
                  >
                    Complete RSVP
                  </button>
                </span>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
