import {
    json,
    type LinksFunction,
    type LoaderFunctionArgs,
} from '@remix-run/node';
import {
    Form,
    Links,
    Meta,
    Scripts,
    ScrollRestoration,
    Outlet,
    useLoaderData,
    Link,
    useRouteError,
    isRouteErrorResponse,
    NavLink,
} from '@remix-run/react';
import appStylesHref from './app.css';
import { getContacts } from './data.server';

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: appStylesHref },
];

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    const contacts = await getContacts(q);

    return json({ contacts, q });
}

export function ErrorBoundary() {
    const error = useRouteError();

    return (
        <html lang="en">
            <head>
                <title>Oops!</title>
                <Meta />
                <Links />
            </head>
            <body className="root-error">
                <h1>
                    {isRouteErrorResponse(error)
                        ? `${error.status} ${error.statusText}`
                        : error instanceof Error
                        ? error.message
                        : 'Unknown Error'}
                </h1>
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    const { contacts, q } = useLoaderData<typeof loader>();

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <div id="sidebar">
                    <h1>Remix Contacts</h1>
                    <div>
                        <Form id="search-form" role="search">
                            <input
                                id="q"
                                aria-label="Search contacts"
                                placeholder="Search"
                                type="search"
                                name="q"
                                defaultValue={q || ''}
                            />
                        </Form>
                        <Form method="post">
                            <Link to="contacts/create" className="buttonLink">
                                Create
                            </Link>
                        </Form>
                    </div>
                    <nav>
                        {contacts.length ? (
                            <ul>
                                {contacts.map((contact: any) => (
                                    <li key={contact.id}>
                                        <NavLink
                                            to={`contacts/${contact.id}`}
                                            className={({ isActive }) =>
                                                isActive ? 'active' : ''
                                            }
                                        >
                                            {contact.first || contact.last ? (
                                                <>
                                                    {contact.first}{' '}
                                                    {contact.last}
                                                </>
                                            ) : (
                                                <i>No Name</i>
                                            )}{' '}
                                            {contact.favorite ? (
                                                <span>★</span>
                                            ) : null}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>
                                <i>No contacts</i>
                            </p>
                        )}
                    </nav>
                </div>

                <div id="detail">
                    <Outlet />
                </div>

                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
