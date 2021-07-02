import dayjs from 'dayjs';
import { process } from '$lib/markdown';
import fs from 'fs';

export function get() {
    console.log('SSR');
    console.log('SSR loading post files');
    let posts = fs
        .readdirSync(`src/posts`)
        .filter((fileName) => /.+\.md$/.test(fileName))
        .map((fileName) => {
            const { metadata } = process(`src/posts/${fileName}`);
            return {
                metadata,
                slug: fileName.slice(0, -3)
            };
        });
    posts.sort(
        (a, b) => dayjs(a.metadata.date, 'MMM D, YYYY') - dayjs(b.metadata.date, 'MMM D, YYYY')
    );
    let body = JSON.stringify(posts);

    return {
        body
    };
}
