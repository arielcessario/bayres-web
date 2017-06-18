import { BayresWebPage } from './app.po';

describe('bayres-web App', () => {
  let page: BayresWebPage;

  beforeEach(() => {
    page = new BayresWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
