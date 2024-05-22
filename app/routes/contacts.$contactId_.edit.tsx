import {
    json,
    type LoaderFunctionArgs,
    type ActionFunctionArgs,
    redirect,
} from '@remix-run/node';
import {
    Form,
    useActionData,
    useLoaderData,
    useNavigate,
} from '@remix-run/react';
import invariant from 'tiny-invariant';
import { getContact, updateContactById } from '~/data.server';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.contactId, 'Missing contactId param');
    const contact = await getContact(params.contactId);

    if (!contact) {
        throw new Response('Not Found', { status: 404 });
    }

    return json({ contact });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
    invariant(params.contactId, 'Missing contactId param');
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const updateResponse = await updateContactById(params.contactId, data);

    if (updateResponse.error) {
        return json({
            data: null,
            error: updateResponse.error,
        });
    }

    return redirect('/contacts/' + params.contactId);
};

export default function EditContact() {
    const { contact } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    return (
        <Form id="contact-form" method="post">
            <p>
                <span>Name</span>
                <input
                    defaultValue={contact.first}
                    aria-label="First name"
                    name="first"
                    type="text"
                    placeholder="First"
                />
                <input
                    aria-label="Last name"
                    defaultValue={contact.last}
                    name="last"
                    placeholder="Last"
                    type="text"
                />
            </p>
            <label>
                <span>Twitter</span>
                <input
                    defaultValue={contact.twitter}
                    name="twitter"
                    placeholder="@jack"
                    type="text"
                />
            </label>
            <label>
                <span>Avatar URL</span>
                <input
                    aria-label="Avatar URL"
                    defaultValue={contact.avatar}
                    name="avatar"
                    placeholder="https://example.com/avatar.jpg"
                    type="text"
                />
            </label>
            <label>
                <span>Notes</span>
                <textarea defaultValue={contact.notes} name="notes" rows={6} />
            </label>
            <p>
                <button className="buttonLink" type="submit">
                    Save
                </button>
                <button className="buttonLink" onClick={() => navigate(-1)}>
                    Cancel
                </button>
            </p>
        </Form>
    );
}
