export interface Author {
  authorImage: {
    asset: {
      path: string;
      url: string;
      metadata: SanityImageMetadata;
    };
  };
  bio: any[];
  name: string;
  slug: {
    current: string;
  };
}

export interface SanityImageMetadata {
  _type: 'sanity.imageMetadata';
  blurHash: string;
  dimensions: {
    _type: 'sanity.imageDimensions';
    aspectRatio: number;
    height: number;
    width: number;
  };
  hasAlpha: boolean;
  isOpaque: boolean;
  lqip: string;
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
      metadata: SanityImageMetadata;
    };
  };
  tags: TagInterface[];
  location: PublishedLocation;
}

export interface TagInterface { slug: string, tagName: string };

export interface AllTags {
  blogTags: TagInterface[];
  mainImageTags: TagInterface[];
  imageCollectionTags: (TagInterface | null)[];
}

export interface BlogPostData {
  _id: string;
  author: Author;
  body: any[];
  tags: TagInterface[];
  excerpt: string;
  location: PublishedLocation;
  mainImage: BlogImage;
  publishedAt: string;
  slug: {
    current: string;
  };
  title: string;
  allTags: AllTags;
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
  _id: string;
  image: {
    asset: {
      url: string;
      metadata: SanityImageMetadata;
    }
  };
  caption: string;
}