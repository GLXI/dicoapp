let electrumServers = { //by default KMD, BTC and LTC supported
    KMD: {
        address: '46.4.87.18',
        port: 10001,
        proto: 'tcp',
        txfee: 0,
        coin: 'KMD',
        altserverList: [
            'electrum1.cipig.net',
            'electrum2.cipig.net'
        ],
    },
    BTC: {
        address: 'electrum.hsmiths.com',
        port: 50001,
        proto: 'tcp',
        txfee: 10000,
        coin: 'BTC',
        altserverList: [
            'helicarrier.bauerj.eu'
        ],
    },
    dICOtoken: {
        address: '0.0.0.0',
        port: 0,
        proto: 'tcp',
        txfee: 10000,
        coin: 'dICOtoken',
        altserverList: [
            'electrum1.cipig.net', //alternative spv - needs to be same port
            'electrum2.cipig.net'
        ],
    }
};

module.exports = electrumServers;
