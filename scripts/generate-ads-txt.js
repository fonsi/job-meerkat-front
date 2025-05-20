const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.prod' });

const OUTPUT_DIR = 'out';
const OUTPUT_FILE = 'ads.txt';

const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

if (!publisherId) {
    console.error(
        'NEXT_PUBLIC_ADSENSE_PUBLISHER_ID is not set in environment variables',
    );
    process.exit(1);
}

const content = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`;
const outDir = path.join(process.cwd(), OUTPUT_DIR);

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, OUTPUT_FILE), content);

console.log(`Generated ${OUTPUT_FILE} file successfully`);
