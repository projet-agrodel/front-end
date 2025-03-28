const fs = require('fs');

// Create the next-env.d.ts file
const nextEnvContent = ` /// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference types="next/navigation-types/navigation" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
` ;

fs.writeFileSync('next-env.d.ts', nextEnvContent);
console.log('Created next-env.d.ts file');