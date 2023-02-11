import styles from './SideBar.module.css';

export default function SideBar () {
  return (
    <div className={ `${styles.sidebar} sidebar-container` }>
      <h1>Sidebar</h1>
    </div>
  );
}