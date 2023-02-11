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

export interface Location {
  locationName: string;
  mapLocation: {
    _type: string;
    lat: number;
    lng: number;
  };
}

export interface MainImage {
  _type: 'blogImage';
  _createdAt: string;
  _id: string;
  author: {
    name: string;
    slug: {
      _type: string;
      current: string;
    };
  };
  caption: string;
  image: {
    asset: {
      path: string;
      url: string;
    };
  };
}

export interface BlogPost {
  _id: string;
  author: Author;
  body: any[];
  categories: Category[];
  excerpt: string;
  location: Location;
  mainImage: MainImage;
  publishedAt: string;
  slug: {
    current: string;
  };
  title: string;
}