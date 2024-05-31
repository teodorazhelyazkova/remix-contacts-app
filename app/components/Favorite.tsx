import { useFetcher } from '@remix-run/react';
import { type FunctionComponent, useMemo } from 'react';
import { type ContactRecord } from '~/data.server';

export const Favorite: FunctionComponent<{
    contact: Pick<ContactRecord, 'favorite'>;
}> = ({ contact }) => {
    const fetcher = useFetcher();
    const favorite = useMemo(
        () =>
            fetcher.formData
                ? fetcher.formData.get('favorite') === 'true'
                : contact.favorite,
        [fetcher.formData, contact.favorite],
    );
    return (
        <fetcher.Form method="post">
            <button
                className="buttonLink"
                aria-label={
                    favorite ? 'Remove from favorites' : 'Add to favorites'
                }
                name="favorite"
                value={favorite ? 'false' : 'true'}
            >
                {favorite ? '★' : '☆'}
            </button>
        </fetcher.Form>
    );
};
