const fetchPosts = async (tag: number) => {
  try {
    const response = await fetch(
      `https://www.youthfulcities.com/wp-json/wp/v2/posts?tags=${tag}&status=publish`
    );
    if (!response.ok) {
      throw new Error('Wordpress network response was not ok');
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching Wordpress posts:', error);
  }
};

export default fetchPosts;
