import { FiCalendar } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';
import styles from './header.module.scss';

export default function Post(): JSX.Element {
  return (
    <article className={styles.container}>
      <h1>Como utilizar Hooks</h1>
      <h2>Pensando em sincronização em vez de ciclos de vida</h2>
      <div>
        <FiCalendar />
        <span>15 Mar 2021</span>
        <FiUser />
        <span>Joseph Oliveira</span>
      </div>
    </article>
  );
}
