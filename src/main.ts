import { preprocess } from 'svelte/compiler';
import { PreprocessorGroup, Processed } from 'svelte/types/compiler/preprocess';

export default exports = module.exports = function (preprocessors: PreprocessorGroup[]): PreprocessorGroup {
  return {
    async markup({ content, filename }): Promise<Processed> {
      const dependencies = [];
      let code = content;
      for (const pp of preprocessors) {
        const processed = await preprocess(code, pp, { filename });
        if (processed && processed.dependencies) {
          dependencies.push(...processed.dependencies);
        }
        code = processed ? processed.code : code;
      }

      return {
        code,
        dependencies
      };
    }
  };
};
