import styles from './SideBar.module.css';

export default function SideBar () {
  return (
    <div className={ `${styles.sidebar} sidebar-container` }>
      <div>
        <h1>Sidebar</h1>
        <ul>
          <li>related blog posts</li>
          <li>related photos</li>
          <li>Related Tags</li>
          <li>search</li>
        </ul>
      </div>
    </div>
  );
}