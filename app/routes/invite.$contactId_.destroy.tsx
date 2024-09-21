import {deleteContact} from '../data'
import {redirect} from "@remix-run/cloudflare";
import type {ActionFunctionArgs} from "@remix-run/cloudflare";
import invariant from "tiny-invariant";

export const action = async({params}: ActionFunctionArgs) => {
    invariant(params.contactId, "No contactId provided");
    await deleteContact(params.contactId);
    return redirect("/");
}
