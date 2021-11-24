import Prismic from '@prismicio/client';
import { GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Post from '../components/Post';
import { getPrismicClient } from '../services/prismic';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  // TODO
  return (
    <>
      {postsPagination.results.map((post: Post) => (
        <Post key={post.uid} />
      ))}
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'main')],
    {
      fetch: [
        'posts.title',
        'posts.content',
        'posts.author',
        'posts.subtitle',
        'posts.banner.url',
      ],
      pageSize: 100,
    }
  );

  console.log(postsResponse);

  const posts: Post[] = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: RichText.asText(post.data.title),
        author: RichText.asText(post.data.author),
        subtitle: RichText.asText(post.data.subtitle),
      },
    };
  });

  const postsPagination: PostPagination = {
    results: posts,
    next_page: postsResponse.next_page,
  };

  return { props: { postsPagination } };
};
