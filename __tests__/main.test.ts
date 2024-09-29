/* eslint @typescript-eslint/no-var-requires: "off", @typescript-eslint/no-empty-function: "off", @typescript-eslint/no-require-imports: "off" */
const seqPreprocess = require('../src/main');
import { preprocess } from 'svelte/compiler';

const content = `
<script>
  export let title = 'Test';
</script>
<style>
  h1 {
    font-size: 2em;
  }
</style>
<h1>{title}</h1>
`;

const noopPreprocessor = {
  markup: () => {},
  script: () => {},
  style: () => {}
};

const passthruPreprocessor = {
  markup: ({ content }) => ({ code: content }),
  script: ({ content }) => ({ code: content }),
  style: ({ content }) => ({ code: content })
};

const depPreprocessor = {
  markup: ({ content }) => ({ code: content, dependencies: [ 'markup' ] }),
  script: ({ content }) => ({ code: content, dependencies: [ 'script' ] }),
  style: ({ content }) => ({ code: content, dependencies: [ 'style' ] })
};

const mock = jest.fn();

const mockPreprocessor = {
  markup: () => { mock('markup'); },
  script: () => { mock('script'); },
  style: () => { mock('style'); }
};

describe('sanity', () => {
  it('noop', async () => {
    const processed = await preprocess(content, seqPreprocess([noopPreprocessor, noopPreprocessor]));
    expect(processed.code).toBe(content);
    expect(processed.dependencies).toHaveLength(0);
  });

  it('passthru', async () => {
    const processed = await preprocess(content, seqPreprocess([passthruPreprocessor, passthruPreprocessor]));
    expect(processed.code).toBe(content);
    expect(processed.dependencies).toHaveLength(0);
  });

  it('deps', async () => {
    const processed = await preprocess(content, seqPreprocess([depPreprocessor, passthruPreprocessor]));
    expect(processed.code).toBe(content);
    expect(processed.dependencies).toHaveLength(3);
    expect(processed.dependencies).toEqual(['markup', 'script', 'style']);
  });
});

describe('order', () => {
  it('basic', async () => {
    mock.mockClear();
    const processed = await preprocess(content, seqPreprocess([mockPreprocessor, mockPreprocessor]));
    expect(processed.code).toBe(content);
    expect(processed.dependencies).toHaveLength(0);
    expect(mock).toHaveReturnedTimes(6);

    expect(mock).toHaveBeenNthCalledWith(1, 'markup');
    expect(mock).toHaveBeenNthCalledWith(2, 'script');
    expect(mock).toHaveBeenNthCalledWith(3, 'style');

    expect(mock).toHaveBeenNthCalledWith(4, 'markup');
    expect(mock).toHaveBeenNthCalledWith(5, 'script');
    expect(mock).toHaveBeenNthCalledWith(6, 'style');
  });
});
