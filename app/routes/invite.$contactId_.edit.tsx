import type { ActionsFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getContact, updateContact } from "../data";

export const action = async ({ params, request }: ActionsFunctionArgs) => {
  invariant(params.contactId, "No contactId provided");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);

  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  console.log(contact);

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Form key={contact.id} id="contact-form" method="post">
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      id="first-name"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      id="last-name"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

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
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="username"
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
                        autocomplete="tel"
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
                  <fieldset>
                    <legend className="text-sm font-semibold leading-6 text-gray-900">
                      Are you bringing children?
                    </legend>
                    <div className="mt-6 space-y-6">
                      <div className="flex items-center gap-x-3">
                        <input
                          id="children-yes"
                          name="children"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          defaultChecked={contact.children === "yes"}
                          value="yes"
                        />
                        <label
                          htmlFor="children-yes"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id="children-no"
                          name="children"
                          type="radio"
                          value="no"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          defaultChecked={contact.children === "no"}
                        />
                        <label
                          htmlFor="children-no"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          No
                        </label>
                      </div>
                    </div>
                  </fieldset>

                  <div className="sm:col-span-3">
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
                        <option value="1">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {contact.Weekender === true && (
                // Are you planning on camping radio
                <>
                  <label>
                    <span>Are you planning on camping?</span>
                    <input
                      defaultChecked={contact.camping === "yes"}
                      name="camping"
                      type="radio"
                      value="yes"
                    />
                    <span>Yes</span>
                    <input
                      defaultChecked={contact.camping === "no"}
                      name="camping"
                      type="radio"
                      value="no"
                    />
                    <span>No</span>
                  </label>

                  {/* Would you be interesting in glamping at an additional cost? radio */}
                  <label>
                    <span>
                      Would you be interested in glamping at an additional cost?
                    </span>
                    <input
                      defaultChecked={contact.glamping === "yes"}
                      name="glamping"
                      type="radio"
                      value="yes"
                    />
                    <span>Yes</span>
                    <input
                      defaultChecked={contact.glamping === "no"}
                      name="glamping"
                      type="radio"
                      value="no"
                    />
                    <span>No</span>
                  </label>
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
                  Publish
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
