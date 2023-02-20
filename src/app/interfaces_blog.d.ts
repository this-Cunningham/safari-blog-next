export interface Author {
  authorImage: {
    asset: {
      path: string;
      url: string;
    };
  };
  bio: string;
  name: string;
  slug: {
    current: string;
  };
}

export interface Category {
  description: string;
  slug: {
    current: string;
  };
  title: string;
}

export interface BlogImage {
  _type: 'blogImage';
  _createdAt: string;
  _id: string;
  author: Author;
  caption: string;
  image: {
    asset: {
      path: string;
      url: string;
    };
  };
  imageTags: string;
  location: PublishedLocation;
}

export interface BlogPostData {
  _id: string;
  author: Author;
  body: any[];
  categories: Category[];
  excerpt: string;
  location: PublishedLocation;
  mainImage: BlogImage;
  publishedAt: string;
  slug: {
    current: string;
  };
  title: string;
}

export interface PublishedLocation {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: 'location';
  _updatedAt: string;
  locationName: string;
  mapLocation: MapLocation;
  locationBlogPosts: BlogPostData[];
  locationImages: BlogImage[];
  slug: {
    current: string;
  };
}

export interface MapLocation {
  _type: string;
  lat: number;
  lng: number;
}

export interface BlockContentImg {
  _type: 'blogImageRef';
  image: {
    asset: {
      url: string;
    }
  }
}