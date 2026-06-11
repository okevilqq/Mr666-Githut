const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');

const files = [
    ['t1.docx', '战略总纲'],
    ['t2.docx', '定位手册'],
    ['t3.docx', '商业模式'],
    ['t4.docx', '赛道分析'],
    ['t5.docx', '白皮书'],
];

const home = process.env.HOME;

for (const [fn, label] of files) {
    console.log('='.repeat(80));
    console.log('FILE: ' + label);
    console.log('='.repeat(80));
    try {
        const dest = home + '/' + fn;
        const tmpDir = fs.mkdtempSync(os.tmpdir() + '\\d_');
        execSync('unzip -o "' + dest + '" -d "' + tmpDir + '" 2>&1');
        const xml = fs.readFileSync(tmpDir + '/word/document.xml', 'utf8');
        const texts = xml.match(/<w:t[^>]*>([^<]*)<\/w:t>/g);
        if (texts) {
            let count = 0;
            let output = '';
            for (const t of texts) {
                const text = t.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, '');
                if (text.trim() && count < 300) {
                    output += text;
                    count++;
                }
            }
            console.log(output.substring(0, 6000));
        }
        fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch(e) {
        console.log('Error: ' + e.message);
    }
    console.log();
}
