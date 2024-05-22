import qs from 'qs';
import { STRAPI_URL } from './utils/constants';
import { flattenContactsAttributes } from './utils/flattenContactsAttributes';

type ContactMutation = {
    id?: string;
    first?: string;
    last?: string;
    avatar?: string;
    twitter?: string;
    notes?: string;
    favorite?: boolean;
};

export type ContactRecord = ContactMutation & {
    id: string;
    createdAt: string;
};

export async function getContacts(q?: string | null) {
    const query = qs.stringify({
        filters: {
            $or: [
                { first: { $contains: q } },
                { last: { $contains: q } },
                { twitter: { $contains: q } },
            ],
        },
        pagination: {
            pageSize: 50,
            page: 1,
        },
    });

    try {
        const response = await fetch(STRAPI_URL + '/api/contacts?' + query);
        const data = await response.json();
        const flattenContactsAttributesData = flattenContactsAttributes(
            data.data
        );

        return flattenContactsAttributesData;
    } catch (error) {
        console.log(error);
        throw new Error('Oh no! Something went wrong');
    }
}

export async function createContact(data: any) {
    try {
        const response = await fetch(STRAPI_URL + '/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: { ...data } }),
        });
        const responseData = await response.json();
        const flattenContactsAttributesData = flattenContactsAttributes(
            responseData.data
        );

        return flattenContactsAttributesData;
    } catch (error) {
        console.log(error);
        throw new Error('Oh no! Something went wrong');
    }
}

export async function getContact(id: string) {
    try {
        const response = await fetch(STRAPI_URL + '/api/contacts/' + id);
        const data = await response.json();
        const flattenContactsAttributesData = flattenContactsAttributes(
            data.data
        );

        return flattenContactsAttributesData;
    } catch (error) {
        console.log(error);
        throw new Error('Oh no! Something went wrong');
    }
}

export async function updateContactById(id: string, updates: ContactMutation) {
    try {
        const response = await fetch(STRAPI_URL + '/api/contacts/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: { ...updates } }),
        });
        const responseData = await response.json();
        const flattenContactsAttributesData = flattenContactsAttributes(
            responseData.data
        );

        return flattenContactsAttributesData;
    } catch (error) {
        console.log(error);
        throw new Error('Oh no! Something went wrong');
    }
}

export async function deleteContact(id: string) {
    try {
        const response = await fetch(STRAPI_URL + '/api/contacts/' + id, {
            method: 'DELETE',
        });
        const data = await response.json();
        const flattenContactsAttributesData = flattenContactsAttributes(
            data.data
        );

        return flattenContactsAttributesData;
    } catch (error) {
        console.log(error);
        throw new Error('Oh no! Something went wrong');
    }
}
