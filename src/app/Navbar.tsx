import styles from './Navbar.module.css';
import { getSanityData } from './BlogPostList';

interface NavBarItem {
  nav_bar_item_slug: 'Home' | 'About us' | 'Blog' | 'Safari Sloop';
  _type: 'navBar';
}

export const Navbar = async () => {
  const { result: navBarItems } = await getSanityData<NavBarItem[]>('*[_type == "navBar"]');

  return (
    <nav className={ styles.navbar }>
      { navBarItems.map(navItem => (
        <div key={ navItem.nav_bar_item_slug } className={ styles.navItem }>
          { navItem.nav_bar_item_slug }
        </div>
      ))}
    </nav>
  )
}

