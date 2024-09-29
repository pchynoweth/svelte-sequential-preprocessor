import { preprocess } from 'svelte/compiler';
import { PreprocessorGroup, Processed } from 'svelte/types/compiler/preprocess';

export default exports = module.exports = function (preprocessors: PreprocessorGroup[]): PreprocessorGroup {
  return {
    async markup({ content, filename }): Promise<Processed> {
      const dependencies: Processed['dependencies'] = [];
      let code = content;
      let map: Processed['map'];
      let attributes: Processed['attributes'];
      let toString: Processed['toString'];

      for (const pp of preprocessors) {
        const processed = await preprocess(code, pp, { filename });
        if (processed && processed.dependencies) {
          dependencies.push(...processed.dependencies);
        }
        code = processed ? processed.code : code;
        map = processed.map ?? map;
        attributes = processed.attributes ?? attributes;
        toString = processed.toString ?? toString;
      }

      return {
        code,
        dependencies,
        map,
        attributes,
        toString,
      };
    }
  };
};
