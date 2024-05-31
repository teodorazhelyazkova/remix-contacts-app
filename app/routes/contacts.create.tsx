import { useActionData, Form, Link } from '@remix-run/react';
import { type ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { createContact } from '~/data.server';
import { contactSchema } from '~/validation/schemas/contact';
import { FormInput } from '~/components/FormInput';

export async function action({ request }: ActionFunctionArgs) {
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
    const newEntry = await createContact(data);

    return redirect('/contacts/' + newEntry.id);
}

export default function CreateContact() {
    const formData = useActionData<typeof action>();

    return (
        <Form method="post">
            <div className="create-form-grid">
                <FormInput
                    aria-label="First name"
                    name="first"
                    type="text"
                    label="First name"
                    placeholder="First"
                    errors={formData?.errors}
                />
                <FormInput
                    aria-label="Last name"
                    name="last"
                    type="text"
                    label="Last name"
                    placeholder="Last"
                    errors={formData?.errors}
                />
                <FormInput
                    name="twitter"
                    type="text"
                    label="Twitter"
                    placeholder="@jack"
                    errors={formData?.errors}
                />
                <FormInput
                    aria-label="Avatar URL"
                    name="avatar"
                    type="text"
                    label="Avatar URL"
                    placeholder="https://example.com/avatar.jpg"
                    errors={formData?.errors}
                />
            </div>
            <div>
                <label>
                    <span>Notes</span>
                    <textarea name="note" rows={6} />
                </label>
            </div>

            <div className="button-group">
                <button className="buttonLink" type="submit">
                    Create
                </button>
                <Link to="/contacts" className="buttonLink">
                    Cancel
                </Link>
            </div>
        </Form>
    );
}
