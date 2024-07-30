const fs = require('fs');
const {getPlayerDetailsCsvRow} = require('./services/parser');
const {loadPlayerUrlsFile} = require('./services/player-urls-loader');
const assert = require('assert');

const playerUrlsFullFile = './files/player-urls-full.csv';
const playerUrlsTestFile = './files/player-urls-test.csv';

const playerDataFullFile = './output/player-data-full.csv';
const playerDataTestFile = './output/player-data-test.csv';

const scanType = process.argv[2];

const row_header = `"player_id","版本日期","名字","全名","描述","头像","身高_cm","体重_kg","出生日期","注册位置","综合能力","潜力","身价","周薪","惯用脚","逆足能力","花式技巧","国际声誉","积极性","身体模型","真实脸型","违约金","特殊","俱乐部ID","俱乐部名字","俱乐部联赛ID","俱乐部联赛名称","俱乐部logo","俱乐部评分","俱乐部位置","俱乐部球衣号码","入队时间","合同到期","国家ID","国家队","国家队联赛ID","国家队联赛名称","国家队旗帜","国家队评分","国家队位置","国家队球衣号码","传中","射术","头球精度","短传","凌空","盘带","弧线","任意球精度","长传","控球","加速","速度","敏捷","反应","平衡","射门力量","弹跳","体能","强壮","远射","侵略性","拦截","进攻跑位","视野","点球","沉着","防守意识","抢断","铲球","鱼跃","手形","开球","站位","反应","比赛风格"\n`;

async function download(fileToRead, fileToWrite) {
    const playerUrlList = fs.readFileSync(fileToRead).toString().trim().split('\n');
    fs.writeFileSync(fileToWrite, row_header, {flag: 'w'});

    let count = 0;
    console.time('scan complete');
    for (let url of playerUrlList) {
        let row = await getPlayerDetailsCsvRow(url);
        fs.writeFileSync(fileToWrite, row + '\n', {flag: 'a'});
        console.log((++count) + '-' + url);
    }
    console.timeEnd('scan complete');
}

(async function start() {
    if (scanType === 'full') {
        console.log('running full scan.');
        await download(playerUrlsFullFile, playerDataFullFile);
    } else if (scanType === 'test') {
        console.log('running test scan.');
        await download(playerUrlsTestFile, playerDataTestFile);
        const content = fs.readFileSync(playerDataTestFile).toString();
        assert(content.includes('2000-07-21'), 'Haaland Birthday not present.');
        assert(content.includes('1998-12-20'), 'Mbappe Birthday not present.');
        console.log('all tests pass ✅');
    } else if (scanType === 'download-urls') {
        console.log('starting to download latest player urls...');
        await loadPlayerUrlsFile('full');
    } else if (scanType === 'download-urls-test') {
        console.log('starting to download latest player urls...');
        await loadPlayerUrlsFile('test');
    }
}());
