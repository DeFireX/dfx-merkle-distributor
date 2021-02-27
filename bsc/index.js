require('dotenv').config();

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.binance.org'));

const bscProviders = ['https://bsc-dataseed.binance.org', 'https://bsc-dataseed1.defibit.io', 'https://bsc-dataseed1.ninicoin.io'];
const BigNumber = require('bignumber.js');
const fs = require('fs');
const {decToHex, zeroPad, pack} = require('../helpers/utils.js');
const { MerkleTree } = require('../helpers/merkleTree.js');

const TOTAL_DFX_DISTRIBUTION = 25 * 1000; // 500,000 DFX
const MIN_BALANCE = 5;

let providerNo = 0;

function nextProvider() {
    providerNo++; if (providerNo > bscProviders.length - 1) providerNo = 0;
    web3.setProvider(new Web3.providers.HttpProvider(bscProviders[providerNo]));
}

(async () => {
    const defirex = new web3.eth.Contract(JSON.parse(`[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"dfProfit","type":"address"}],"name":"CreateDfProfit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint64","name":"index","type":"uint64"},{"indexed":false,"internalType":"uint64","name":"daiProfit","type":"uint64"}],"name":"Profit","type":"event"},{"constant":true,"inputs":[],"name":"BRIDGE_ADDRESS","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"addProfit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"appendDDai","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"burnDDai","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"uint256","name":"max","type":"uint256"}],"name":"calcUserProfit","outputs":[{"internalType":"uint256","name":"totalDaiProfit","type":"uint256"},{"internalType":"uint64","name":"index","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"dfProfits","outputs":[{"internalType":"contract DfProfits","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"extractDaiFromVenusFarm","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"uint64","name":"fromIndex","type":"uint64"},{"internalType":"uint256","name":"max","type":"uint256"}],"name":"getUserProfitFromCustomIndex","outputs":[{"internalType":"uint256","name":"totalDaiProfit","type":"uint256"},{"internalType":"uint64","name":"index","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"newOwner","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastProfitDistIndex","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"moveDaiToVenusFarm","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"profits","outputs":[{"internalType":"uint64","name":"blockNumber","type":"uint64"},{"internalType":"uint64","name":"daiProfit","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint64","name":"max","type":"uint64"}],"name":"selfClaimProfit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalUnlockedDDai","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"ethAddress","type":"address"}],"name":"transferToEth","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferToEth","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint64","name":"max","type":"uint64"}],"name":"userClaimProfit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"uint256","name":"snapshotId","type":"uint256"}],"name":"userShare","outputs":[{"internalType":"uint256","name":"totalLiquidity","type":"uint256"},{"internalType":"uint256","name":"totalSupplay","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address[]","name":"tokens","type":"address[]"}],"name":"withdrawTokenAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]`), '0xCa0648C5b4Cea7D185E09FCc932F5B0179c95F17');
    const dDAI = new web3.eth.Contract(JSON.parse(`[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Delegated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"Snapshot","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Undelegated","type":"event"},{"constant":false,"inputs":[],"name":"acceptOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"snapshotId","type":"uint256"}],"name":"balanceOfAt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOfWithDelegated","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOfWithoutReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"delegates","outputs":[{"internalType":"uint128","name":"delegatedBalance","type":"uint128"},{"internalType":"uint128","name":"receivedBalance","type":"uint128"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"delgate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint8","name":"decimals","type":"uint8"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"newOwner","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"uint8","name":"_decimals","type":"uint8"},{"internalType":"address payable","name":"_controller","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"prices","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"name":"snapshot","outputs":[{"internalType":"uint256","name":"currentId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"snapshot","outputs":[{"internalType":"uint256","name":"currentId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"snapshotId","type":"uint256"}],"name":"totalSupplyAt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address[]","name":"recipients","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"undelgate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]`), '0x308853AeC7cF0ECF133ed19C0c1fb3b35f5a4E7B');
    const minBlock = 4416559;
    const maxBlock = 5214600;

    let uniqueAddresses = [];
    const STEP = 100000;
    for (let fromBlock = minBlock; fromBlock <= maxBlock; fromBlock += STEP) {
        const retDelegated = (await dDAI.getPastEvents('Delegated', {
            fromBlock: fromBlock,
            toBlock: fromBlock + STEP > maxBlock ? maxBlock : fromBlock + STEP
        })).map(x => {
            const {recipient, amount} = x.returnValues;
            return {recipient, amount};
        });

        let ret = (await dDAI.getPastEvents('Transfer', {
            fromBlock: fromBlock,
            toBlock: fromBlock + STEP > maxBlock ? maxBlock : fromBlock + STEP
        }));
        const beforeExcludeDelegated = ret.length;
        ret = ret.filter(x => {
            return retDelegated.indexOf(x.transactionHash.toLowerCase()) == -1; // exclude delegated trx
        });

        for (let row of ret) {
            const {to, from} = row.returnValues;
            for(let address of [to.toLowerCase(), from.toLowerCase()]) {
                if (uniqueAddresses.indexOf(address) === -1) uniqueAddresses.push(address);
            }
        }

        console.log('ret',beforeExcludeDelegated, ret.length);
        nextProvider();
    }
    console.log(`${uniqueAddresses.length} unique address`);

    const dfxDistributionShare = {};
    let n = 3; // skip first 3 profits - has devs only
    let totalShare = 0;
    let lastBlock = minBlock;
    let totalTime = 0;
    while (true) {
        const {blockNumber} = await defirex.methods.profits(n).call();
        if (blockNumber > maxBlock) break;
        const lastBlockInfo = await web3.eth.getBlock(lastBlock, false);
        const currentBlockInfo = await web3.eth.getBlock(blockNumber, false);
        const timeDiff = currentBlockInfo.timestamp - lastBlockInfo.timestamp;
        totalTime += timeDiff;
        const coef = 1 / (n + 1);
        console.log('snapshot', n, 'coef', coef);
        for(const address of uniqueAddresses) {
            const {totalLiquidity, totalSupplay} = await defirex.methods.userShare(address, n + 1).call();
            if (!dfxDistributionShare[address]) dfxDistributionShare[address] = 0;
            const currentShare = (totalLiquidity * timeDiff / totalSupplay * coef) || 0;
            dfxDistributionShare[address] += currentShare;
            totalShare += currentShare;
        }
        n++;
        lastBlock = blockNumber;
        nextProvider();
    }
    totalShare /= totalTime;
    fs.writeFileSync('./bscDfxDistributionShare.tmp', JSON.stringify({dfxDistributionShare, totalShare, totalTime}), 'utf8');
    // let {dfxDistributionShare, totalShare, totalTime} = JSON.parse(fs.readFileSync('./dfxDistributionShare.tmp', 'utf8'));

    // Write to file total distribution
    const finalDist = [];
    fs.writeFileSync('./bscDfxDistributionFinal.tmp', '', 'utf8');
    for(const address of uniqueAddresses) {
        let amount = Math.floor((dfxDistributionShare[address] / totalTime * TOTAL_DFX_DISTRIBUTION / totalShare) * 100) / 100;
        if (amount < MIN_BALANCE) amount = MIN_BALANCE;
        console.log(address, amount);
        finalDist.push({address, amount});
    }
    const greaterThenMinUsers = finalDist.filter(x => x.amount > MIN_BALANCE);
    const totalNotMin = greaterThenMinUsers.reduce((memo, x)=>memo + x.amount, 0);
    const diff =  finalDist.reduce((memo, x)=>memo + x.amount, 0) - TOTAL_DFX_DISTRIBUTION;
    for(let user of greaterThenMinUsers) {
        user.amount -= diff * user.amount / totalNotMin;
    }

    for(let {address, amount} of finalDist) {
        fs.appendFileSync('./bscDfxDistributionFinal.tmp', `${address} ${amount}\r\n`, 'utf8');
    }

    // Generate Merkle Tree
    let totalFunds = 0;
    let gIndex = 0;
    const elements = finalDist.map((x)=>{
        const index = gIndex++;
        const address = x.address;
        const amount = new BigNumber(x.amount).multipliedBy(10**18).toString(10);
        if (address.length != 42) throw new Error();
        const packed = pack([index, address, amount], [256, 160, 256]);
        totalFunds += amount * 1;
        return {leaf: Buffer.from(packed, 'hex'), index: index, address: address, amount};
    });

    const merkleTree = new MerkleTree(elements.map(x =>x.leaf));

    const root = merkleTree.getHexRoot();
    console.info('root', root);
    console.info('totalFunds', totalFunds);

    fs.writeFileSync('./bsc-dfx-merkle-distributor.json',
        JSON.stringify(elements.map((x)=>{
            return {proofs: merkleTree.getHexProof(x.leaf), index: x.index, address: x.address, amount : x.amount};
        })), 'utf8');



})();


