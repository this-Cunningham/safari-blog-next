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

export interface MainImage {
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

export interface Location {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  locationName: string;
  mapLocation: MapLocation;
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