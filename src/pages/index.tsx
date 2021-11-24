import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps } from 'next';
import { useState } from 'react';
import Post from '../components/Post';
import { getPrismicClient } from '../services/prismic';
import styles from './home.module.scss';

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
  const [postsPaginationCopy, setPostsPaginationCopy] =
    useState(postsPagination);

  async function handleLoadMorePosts(): Promise<void> {
    fetch(postsPagination.next_page, { method: 'GET' })
      .then(response => response.json())
      .then(json => {
        const newPosts: Post[] = json.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: format(
              new Date(post.first_publication_date),
              'dd LLL yyyy',
              { locale: ptBR }
            ),
            data: {
              title: post.data.title,
              author: post.data.author,
              subtitle: post.data.subtitle,
            },
          };
        });

        const newPostsPagination: PostPagination = {
          results: [...postsPaginationCopy.results, ...newPosts],
          next_page: json.next_page,
        };

        setPostsPaginationCopy(newPostsPagination);
      })
      .catch(err => console.log(err.message));
  }

  return (
    <section className={styles.container}>
      {postsPaginationCopy.results.map((post: Post) => (
        <Post
          key={post.uid}
          title={post.data.title}
          author={post.data.author}
          subtitle={post.data.subtitle}
          date={post.first_publication_date}
        />
      ))}
      {postsPaginationCopy.next_page && (
        <button type="button" onClick={handleLoadMorePosts}>
          Carregar mais posts
        </button>
      )}
    </section>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.author', 'posts.subtitle'],
      pageSize: 2,
    }
  );

  const posts: Post[] = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd LLL yyyy',
        { locale: ptBR }
      ),
      data: {
        title: post.data.title,
        author: post.data.author,
        subtitle: post.data.subtitle,
      },
    };
  });

  const postsPagination: PostPagination = {
    results: posts,
    next_page: postsResponse.next_page,
  };

  return { props: { postsPagination } };
};
