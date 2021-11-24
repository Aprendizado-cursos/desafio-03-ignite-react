import { FiCalendar } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';
import styles from './header.module.scss';

interface PostProps {
  title: string;
  subtitle: string;
  author: string;
  date: string;
}

export default function Post({ ...props }: PostProps): JSX.Element {
  return (
    <article className={styles.container}>
      <h1>{props.title}</h1>
      <h2>{props.subtitle}</h2>
      <div>
        <FiCalendar />
        <span>{props.date}</span>
        <FiUser />
        <span>{props.author}</span>
      </div>
    </article>
  );
}
