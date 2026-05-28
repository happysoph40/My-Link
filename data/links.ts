export interface DummyLink {
  id: string;
  title: string;
  url: string;
  faviconUrl: string;
  order: number;
  clickCount: number;
  createdAt: string;
}

export const dummyLinks: DummyLink[] = [
  {
    id: 'link-1',
    title: 'GitHub (깃허브)',
    url: 'https://github.com/happysoph40',
    faviconUrl: 'https://s2.googleusercontent.com/s2/favicons?domain=github.com&sz=64',
    order: 1,
    clickCount: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'link-2',
    title: '네이버 블로그',
    url: 'https://blog.naver.com',
    faviconUrl: 'https://s2.googleusercontent.com/s2/favicons?domain=blog.naver.com&sz=64',
    order: 2,
    clickCount: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'link-3',
    title: '인스타그램',
    url: 'https://instagram.com',
    faviconUrl: 'https://s2.googleusercontent.com/s2/favicons?domain=instagram.com&sz=64',
    order: 3,
    clickCount: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'link-4',
    title: '개인 포트폴리오',
    url: 'https://github.com/happysoph40/My-Link',
    faviconUrl: 'https://s2.googleusercontent.com/s2/favicons?domain=github.com&sz=64',
    order: 4,
    clickCount: 0,
    createdAt: new Date().toISOString()
  }
];

