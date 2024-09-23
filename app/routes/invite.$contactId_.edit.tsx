import type { ActionsFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";
import stringToBool  from "../utils/stringToBool";
import { getContact, updateContact } from "../data";
import RadioPair from "../components/RadioPair";
export const action = async ({ params, context, request }: ActionsFunctionArgs) => {
  invariant(params.contactId, "No contactId provided");
  
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact({id: params.contactId, updates, apiKey: context.cloudflare.env.AIRTABLE_API_KEY, baseID: context.cloudflare.env.AIRTABLE_BASE_ID, tableID: context.cloudflare.env.AIRTABLE_TABLE_ID});
  return redirect(`/invite/${params.contactId}`);
};

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact({id:params.contactId, apiKey:context.cloudflare.env.AIRTABLE_API_KEY, baseID: context.cloudflare.env.AIRTABLE_BASE_ID, tableID: context.cloudflare.env.AIRTABLE_TABLE_ID});

  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const weekender = stringToBool(contact.weekender);

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    defaultValue="no"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email Address
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        id="email"
                        name="email"
                        placeholder="Email address"
                        autoComplete="email"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Phone Number
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        defaultValue={contact.last}
                        id="phone"
                        name="phone"
                        placeholder="Phone number"
                        autoComplete="tel"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Dietary Restrictions
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="dietary"
                      name="dietary"
                      defaultValue={contact.dietary}
                      rows={3}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                      How many children are you bringing?
                    </label>
                    <div className="mt-2">
                      <select
                        id="numChildren"
                        name="numChildren"
                        defaultValue={contact.numChildren}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
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
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <fieldset>
                      <RadioPair
                        legend="Are you planning on camping?"
                        name="planOnCamping"
                        defaultChecked={contact.planOnCamping}
                      />
                    </fieldset>
                  </div>
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    {/* Would you be interesting in glamping at an additional cost? radio */}
                    <fieldset>
                      <RadioPair
                        legend=" Would you be interested in glamping at an additional
                        cost?"
                        name="wantGlamping"
                        defaultChecked={contact.wantGlamping}
                      />
                    </fieldset>
                  </div>
                </>
              )}

              <div className="col-span-full">
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end lg:ml-4 lg:mt-0">
                <span className="ml-3 hidden sm:block">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                </span>

                <span className="sm:ml-3">
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
