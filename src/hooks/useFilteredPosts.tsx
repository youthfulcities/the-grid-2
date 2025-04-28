import fetchPosts from '@/utils/fetchPosts';
import { useEffect, useState } from 'react';

interface Post {
  id: string;
  title: { rendered: string };
  link: string;
  yoast_head_json: { og_image: { url: string }[]; og_description: string };
  class_list: string[];
}

// 49 = housing
// 50 = youthhousingcanada
// 47 = devlab
// 26 = work

const useFilteredPosts = (tag: number, lng: string): Post[] => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!tag || !fetchPosts) return;

    const fetchAndFilterPosts = async () => {
      try {
        const res = await fetchPosts(tag);
        const filteredRes = res.filter((post: Post) =>
          lng === 'fr'
            ? post.class_list.includes('tag-fr')
            : !post.class_list.includes('tag-fr')
        );
        setPosts(filteredRes);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchAndFilterPosts();
  }, [tag, lng, fetchPosts]);

  return posts;
};

export default useFilteredPosts;
