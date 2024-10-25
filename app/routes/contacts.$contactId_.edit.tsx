import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getContact, updateContact } from "~/data";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.contactId, "Missing Contact ID parameter.");

    const contact = await getContact(params.contactId);
    if (!contact) throw new Response("Not Found", { status: 404 });

    return json({ contact });
};

export const action = async ({params, request}: ActionFunctionArgs ) => {
    invariant(params.contactId, "Missing Contact ID parameter.");
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);

    await updateContact(params.contactId, updates);
    return redirect(`/contacts/${params.contactId}`)
}

export default function EditContact() {
    const { contact } = useLoaderData<typeof loader>();
    const navigate = useNavigate()

    return (
        <Form
            key={contact.id}
            id="contact-form"
            method="post">
            <p>
                <span>Name</span>
                <input
                    defaultValue={contact.first}
                    name="first"
                    placeholder="First"
                    aria-label="First name"
                    type="text"
                />
                <input
                    defaultValue={contact.last}
                    name="last"
                    placeholder="Last"
                    aria-label="Last name"
                    type="text"
                />
            </p>

            <label>
                <span>Twitter</span>
                <input
                    defaultValue={contact.twitter}
                    name="twitter"
                    placeholder="@burusu"
                    type="text"
                />
            </label>

            <label>
                <span>Avatar URL</span>
                <input
                    defaultValue={contact.avatar}
                    aria-label="Avatar URL"
                    name="avatar"
                    placeholder="https://placecats.com/200/200"
                    type="text"
                />
            </label>

            <label>
                <span>Notes</span>
                <textarea
                    defaultValue={contact.notes}
                    name="notes"
                    rows={6}></textarea>
            </label>

            <p>
                <button type="submit">Save</button>
                <button onClick={() => navigate(-1)} type="button">Cancel</button>
            </p>
        </Form>
    );
}
