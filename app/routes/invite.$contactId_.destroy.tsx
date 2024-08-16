import {deleteContact} from '../data'
import {redirect} from "@remix-run/node";
import type {ActionFunctionArgs} from "@remix-run/node";
import invariant from "tiny-invariant";

export const action = async({params}: ActionFunctionArgs) => {
    invariant(params.contactId, "No contactId provided");
    await deleteContact(params.contactId);
    return redirect("/");
}
