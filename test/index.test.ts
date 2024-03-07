import { RuleTester } from 'eslint';
import { rules } from '../src/index';
import { logger } from 'rslog';

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2017 }
});


ruleTester.run(
  "local-storage-without-try-catch", // rule name
  rules['local-storage-without-try-catch'], // rule code
  {
    valid: [{
      code: `
      function d () {
try{
  localStorage.setItem('test', 'test');

}catch(e) {}

      }
      `,
    }, {
      code: `
      try {
        function a () {
          localStorage.setItem('test', 'test');
        }
      }catch(e) {}
      `,
    }],
    // 'invalid' checks cases that should not pass
    invalid: [
      {
        code: `localStorage.setItem('test', 'test');`,
        errors: [{
          message: 'localStorage.setItem is not allowed in this scope without a try catch block'
        }],
        output: `localStorage.setItem('test', 'test');`
      },
      {
        code: `
function a () {
  localStorage.setItem('test', 'test');
}
`,
        errors: [{
          message: 'localStorage.setItem is not allowed in this scope without a try catch block'
        }],
        output: `
function a () {
  localStorage.setItem('test', 'test');
}
`
      },
    ],
  }
);

logger.success("All tests passed!");
