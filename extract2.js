const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');

const files = [
    ['v1.docx', '视觉与超级符号'],
    ['v2.docx', '策略与营销落地'],
    ['v3.docx', '战略升级与护城河'],
    ['v4.docx', '分润与会员体系'],
    ['v5.docx', '30天冷启动'],
    ['v6.docx', '单社区财务模型'],
    ['v7.docx', '样板社区标准'],
    ['v8.docx', '城市服务商管理'],
    ['v9.docx', '集团顶层设计'],
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
            console.log(output.substring(0, 4000));
        }
        fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch(e) {
        console.log('Error: ' + e.message);
    }
    console.log();
}
