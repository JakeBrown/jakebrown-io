export async function get() {
    let posts = import.meta.glob('./posts/*.svx');
    console.log('Running request route');
    let body = [];
    console.log(posts);
    for (const path in posts) {
        console.log(path);
        let post = await posts[path]();
        body.push({
            metadata: post.metadata,
            slug: path.replace('./posts/', '').replace('.svx', '')
        });
    }
    body.sort(function (a, b) {
        if (a.metadata.date > b.metadata.date) {
            return -1;
        } else {
            return 1;
        }
    });

    return {
        body: body,
        status: 200
    };
}
