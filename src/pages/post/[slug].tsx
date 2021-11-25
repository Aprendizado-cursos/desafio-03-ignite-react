import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../../services/prismic';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  uid: string;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) return <h1>Carregando...</h1>;

  function handleCalculateReadingTime(): number {
    let words = 0;
    post.data.content.forEach(content => {
      content.body.forEach(paragraph => {
        words += paragraph.text.split(' ').length;
      });
    });

    return Math.ceil(words / 200);
  }

  return (
    <section className={styles.container}>
      <img id="banner" src={post.data.banner.url} alt="banner" />
      <header>
        <h1>{post.data.title}</h1>
        <div>
          <FiCalendar />
          <span>
            {format(new Date(post.first_publication_date), 'dd LLL yyyy', {
              locale: ptBR,
            })}
          </span>
          <FiUser />
          <span>{post.data.author}</span>
          <FiClock />
          <span>{handleCalculateReadingTime()} min</span>
        </div>
      </header>
      <main>
        {post.data.content.map(({ heading, body }) => (
          <Fragment key={heading}>
            <h1>{heading}</h1>
            {body.map(({ text }) => (
              <p key={text}>{text}</p>
            ))}
          </Fragment>
        ))}
      </main>
    </section>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts'),
  ]);

  const paths = posts.results.map(post => {
    return {
      params: { slug: post.uid },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post: Post = {
    first_publication_date: response.first_publication_date,
    uid: response.uid,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60 * 24, // 24H
  };
};
