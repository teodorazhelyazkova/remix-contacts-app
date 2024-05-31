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
import { FormInput } from '~/components/FormInput';
import { getContact, updateContactById } from '~/data.server';
import { contactSchema } from '~/validation/schemas/contact';

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

    const validatedFields = contactSchema.safeParse({
        avatar: data.avatar,
        first: data.first,
        last: data.last,
        twitter: data.twitter,
    });

    if (!validatedFields.success) {
        return json({
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Please fil out all missing fields.',
            data: null,
        });
    }

    const updateResponse = await updateContactById(params.contactId, data);

    if (updateResponse.error) {
        return json({
            data: null,
            errors: updateResponse.error,
        });
    }

    return redirect('/contacts/' + params.contactId);
};

export default function EditContact() {
    const { contact } = useLoaderData<typeof loader>();
    const formData = useActionData<typeof action>();

    const navigate = useNavigate();

    return (
        <Form id="contact-form" method="post">
            <div className="create-form-grid">
                <FormInput
                    defaultValue={contact.first}
                    aria-label="First name"
                    name="first"
                    type="text"
                    label="First name"
                    placeholder="First"
                    errors={formData?.errors}
                />
                <FormInput
                    aria-label="Last name"
                    defaultValue={contact.last}
                    name="last"
                    label="Last name"
                    placeholder="Last"
                    type="text"
                    errors={formData?.errors}
                />
                <FormInput
                    defaultValue={contact.twitter}
                    name="twitter"
                    label="Twitter"
                    placeholder="@jack"
                    type="text"
                    errors={formData?.errors}
                />
                <FormInput
                    aria-label="Avatar URL"
                    defaultValue={contact.avatar}
                    name="avatar"
                    label="Avatar URL"
                    placeholder="https://example.com/avatar.jpg"
                    type="text"
                    errors={formData?.errors}
                />
            </div>
            <div>
                <label>
                    <span>Notes</span>
                    <textarea
                        defaultValue={contact.notes}
                        name="notes"
                        rows={6}
                    />
                </label>
            </div>

            <div className="button-group">
                <button className="buttonLink" type="submit">
                    Save
                </button>
                <button className="buttonLink" onClick={() => navigate(-1)}>
                    Cancel
                </button>
            </div>
        </Form>
    );
}
