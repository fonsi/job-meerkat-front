import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const OUTPUT_DIR = '.output/public';
const OUTPUT_FILE = 'ads.txt';

const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

if (!publisherId) {
    console.log(
        'Skipping ads.txt: NEXT_PUBLIC_ADSENSE_PUBLISHER_ID is not set.',
    );
    process.exit(0);
}

const content = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`;
const outDir = path.join(process.cwd(), OUTPUT_DIR);

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, OUTPUT_FILE), content);

console.log(`Generated ${OUTPUT_FILE} file successfully`);
