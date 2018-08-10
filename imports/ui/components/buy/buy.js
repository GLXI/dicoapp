import './buy.html';


import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Userdata } from '/imports/api/userdata/userdata.js';
import { Tradedata } from '/imports/api/tradedata/tradedata.js';
import { Swapdata } from '/imports/api/swapdata/swapdata.js';
import tokenconfig from '/imports/api/config/electrum.js';

import '../animations/sloader.html';
import '../animations/check.html';

const numcoin = 100000000;

Template.buy.onCreated(function () {
    function init() {
        try {
            Session.set("pricekmd", Tradedata.findOne({ key: "priceKMD" }).price / numcoin);
            Session.set("priceltc", Tradedata.findOne({ key: "priceLTC" }).price / numcoin);
            Session.set("pricebtc", Tradedata.findOne({ key: "priceBTC" }).price / numcoin);
            // if(Tradedata.findOne({key:"priceKMD"}).price/numcoin > 0){
            //   Session.set("ready", true);
            // }else{
            //   Session.set("ready", false);
            // }
        }
        catch (e) {
            Session.set("ready", false);
            Session.set("pricekmd", "NaN");
            Session.set("priceltc", "NaN");
            Session.set("pricebtc", "NaN");
        }

    }
    if (!Meteor.isDesktop) {
        Meteor.subscribe('userdata.all');
        Meteor.subscribe('swapdata.all');
        this.subscribe('tradedata.all', {
            onReady: function () {
                init();
            },
            onError: function () {
            }
        });
    } else {
        init();
    }

    Session.set("currentcoin", "BTC");
    Session.set("selected_amount", 1000000);
});

Template.registerHelper('loading', function () {
    return Session.get("loading");
});

Template.buy.helpers({
    activeSendButton: function () {
        //return Session.get("activeSendButton");
    },
    activeAddressButton: function () {
        //return Session.get("activeAddressButton");
    },
    coins: function () {
        return ["KMD", "BTC", "LTC"];
    },
    currentcoin: function () {
        return Session.get("currentcoin");
    },
    setCurrentCoin: function(coin){
        Session.set("currentcoin", coin);
    },
    balance: function () {
        return Userdata.findOne({ coin: Session.get("coin") }) && parseFloat(Userdata.findOne({ coin: Session.get("coin") }).balance / numcoin).toFixed(8);
    },
    balanceKMD: function () {
        return Userdata.findOne({ coin: "KMD" }) && parseFloat(Userdata.findOne({ coin: "KMD" }).balance / numcoin).toFixed(8);
    },
    balancedICOT: function () {
        return Userdata.findOne({ coin: tokenconfig.dICOtoken.coin }) && parseFloat(Userdata.findOne({ coin: tokenconfig.dICOtoken.coin }).balance / numcoin).toFixed(8);
    },
    balanceLTC: function () {
        return Userdata.findOne({ coin: "LTC" }) && parseFloat(Userdata.findOne({ coin: "LTC" }).balance / numcoin).toFixed(8);
    },
    dICOTName: function () {
        return tokenconfig.dICOtoken.coin;
    },
    balanceBTC: function () {
        return Userdata.findOne({ coin: "BTC" }) && parseFloat(Userdata.findOne({ coin: "BTC" }).balance / numcoin).toFixed(8);
    },
    address: function () {
        return Userdata.findOne({ coin: Session.get("currentcoin") }) && Userdata.findOne({ coin: Session.get("currentcoin") }).smartaddress.toString();
    },
    selectedCoinKMD: function () {
        if (Session.get("currentcoin") == "KMD") {
            return true;
        } else {
            return false;
        }
    },
    selectedCoinLTC: function () {
        if (Session.get("currentcoin") == "LTC") {
            return true;
        } else {
            return false;
        }
    },
    selectedCoinBTC: function () {
        if (Session.get("currentcoin") == "BTC") {
            return true;
        } else {
            return false;
        }
    },

    activecoinKMD: function () {
        if (Session.get("coin") == "KMD") {
            return true;
        } else {
            return false;
        }
    },
    activecoindICOT: function () {
        if (Session.get("coin") == tokenconfig.dICOtoken.coin) {
            return true;
        } else {
            return false;
        }
    },
    activecoinLTC: function () {
        if (Session.get("coin") == "LTC") {
            return true;
        } else {
            return false;
        }
    },
    activecoinBTC: function () {
        if (Session.get("coin") == "BTC") {
            return true;
        } else {
            return false;
        }
    },
    pricekmd: function () {
        return Tradedata.findOne({ key: "priceKMD" }) && Tradedata.findOne({ key: "priceKMD" }).price / numcoin;
    },
    pricebtc: function () {
        return Tradedata.findOne({ key: "priceBTC" }) && Tradedata.findOne({ key: "priceBTC" }).price / numcoin ? (Tradedata.findOne({ key: "priceBTC" }) && Tradedata.findOne({ key: "priceBTC" }).price / numcoin).toFixed(8) : 0;
    },
    priceltc: function () {
        return Tradedata.findOne({ key: "priceLTC" }) && Tradedata.findOne({ key: "priceLTC" }).price / numcoin;
    },
    ready: function () {
        return Tradedata.findOne({ key: "priceKMD" }) &&
        Tradedata.findOne({ key: "priceKMD" }).price / numcoin > 0 &&
        Tradedata.findOne({ key: "priceBTC" }) &&
        Tradedata.findOne({ key: "priceBTC" }).price / numcoin > 0 &&
        Tradedata.findOne({ key: "priceLTC" }) &&
        Tradedata.findOne({ key: "priceLTC" }).price / numcoin > 0;
    },
    pricemongokmd: function () {
        return Tradedata.findOne({ key: "priceKMD" }).price / numcoin;
    },
    total: function () {
        return Session.get("price"); //* Session.get("buyamount")/numcoin;
    },
    swaps: function () {
        return Swapdata.find({}, { sort: { createdAt: -1 } });
    },
    buyDisabled: function () {
        return Session.get("buyInProgress") === 'yes';
    },
    amountBTC: function (){
        var amount = Session.get("selected_amount");
        if(!amount) return 0;
        return (Number(amount) * Number(Tradedata.findOne({ key: "priceBTC" }) && Tradedata.findOne({ key: "priceBTC" }).price / numcoin)).toFixed(8);
    },
    amountLTC: function (){
        var amount = Session.get("selected_amount");
        if(!amount) return 0;
        return (Number(amount) * Number(Tradedata.findOne({ key: "priceLTC" }) && Tradedata.findOne({ key: "priceLTC" }).price / numcoin)).toFixed(8);
    },
    amountKMD: function (){
        var amount = Session.get("selected_amount");
        if(!amount) return 0;
        return (Number(amount) * Number(Tradedata.findOne({ key: "priceKMD" }) && Tradedata.findOne({ key: "priceKMD" }).price / numcoin)).toFixed(8);
    }
});

Template.registerHelper('formatDate', function (date) {
    return moment(date).format('MM-DD-YYYY');
});

Template.registerHelper('and', (a, b) => {
    return a && b;
});
Template.registerHelper('or', (a, b) => {
    return a || b;
});
Template.registerHelper('usdPrice', () => {
    const _prices = Session.get('remotePrices');

    if (_prices &&
        _prices[tokenconfig.dICOtoken.coin.toLowerCase()] &&
        _prices[tokenconfig.dICOtoken.coin.toLowerCase()].usd) {
        return Number(_prices[tokenconfig.dICOtoken.coin.toLowerCase()].usd).toFixed(4);
    }
});

Template.buy.events({
    "keyup #bntnbuyamount": function (event, template) {
        const amount = template.find(".bntnbuyamount").value;
        Session.set("selected_amount", Number(template.find(".bntnbuyamount").value));
        const _prices = Session.get('remotePrices');
        if (_prices &&
            _prices[tokenconfig.dICOtoken.coin.toLowerCase()] &&
            _prices[tokenconfig.dICOtoken.coin.toLowerCase()].usd) {
        }
    },
    "click .buybloc": function (event, template) {
        event.preventDefault();
        const amount = Number(Number(template.find(".bntnbuyamount").value).toFixed(8)) * numcoin;
        var unspent = 0;

        function handleResult(coin, result) {
            unspent = result.length;
            if (unspent > 1) {
                if (Meteor.isDesktop) {
                    Desktop.fetch('marketmaker', 'buy', 60000, amount, coin)
                        .then(result => {
                            if (result[0]) {
                                swal("Buy issued", "locked for 3 mins", "success");
                            } else {
                                swal("Oops!", result[1], "error");
                            }
                            Session.set('buyInProgress', 'no');
                        })
                        .catch(e => {
                            swal("Oops!", error.toString(), "error");
                            Session.set('buyInProgress', 'no');
                        });
                } else {
                    Meteor.call("buy", amount, coin, function (error, result) {
                        if (error) {
                            //console.log(error);
                            //  console.log("C "+error.error.message);
                            swal("Oops!", error.message, "error");
                            //swal("Oops!", error.error.message, "error");
                        } else {
                            swal("Buy issued", "locked for 3 mins", "success");
                        }
                    });
                }

            } else {
                if (Number(Userdata.findOne({
                    coin: coin
                }).balance) > ((amount / numcoin * Tradedata.findOne({
                    key: "price" + coin
                }).price / numcoin) + Number(0.00010000 * numcoin)) && amount > 0) {
                    if (Meteor.isDesktop) {
                        Desktop.fetch('marketmaker', 'buy', 60000, amount, coin)
                            .then(result => {
                                if (result[0]) {
                                    console.log(result[1]);
                                    swal("Your funds are being prepared", "please wait a few minutes before buying again.", "success");
                                } else {
                                    console.log(result[1]);
                                    swal("Oops!", result[1], "error");
                                }
                                Session.set('buyInProgress', 'no');
                            })
                            .catch(e => {
                                swal("Oops!", error.toString(), "error");
                                Session.set('buyInProgress', 'no');
                            });
                    } else {
                        Meteor.call("buy", amount, coin, function (error, result) {
                            if (error) {
                                //console.log(error);
                                console.log(error.error);
                                swal("Oops!", error.error.message, "error");
                            } else {
                                console.log(result);
                                swal("Your funds are being prepared", "please wait a few minutes before buying again.", "success");
                            }
                        });
                    }
                } else {
                    {
                        console.log("error");
                        swal("Oops!", "Amount is too big or too small.", "error");
                    }
                }
            }
        }

        const _coin = Session.get('currentcoin');
        if (Number(Userdata.findOne({
            coin: _coin
        }).balance) > ((amount / numcoin * Tradedata.findOne({
            key: "price" + _coin
        }).price / numcoin) + Number(0.00010000 * numcoin)) && amount > 0) {
            //start unspent

            if (Meteor.isDesktop) {
                Session.set('buyInProgress', 'yes');
                Desktop.fetch('marketmaker', 'listUnspent', 60000, _coin)
                    .then(result => {
                        if (result[0]) {
                            handleResult(_coin, result[1]);
                        } else {
                            console.log(result[1]);
                            swal("Oops!", result[1], "error");
                            Session.set('buyInProgress', 'no');
                        }
                    })
                    .catch(e => {
                        console.log(e);
                        Session.set('buyInProgress', 'no');
                        swal("Oops!", e.toString(), "error");
                    });
            } else {
                Meteor.call("listunspent", _coin, function (error, result) {
                    if (error) {
                        // console.log(error);
                        console.log(error.error);
                        swal("Oops!", error.error, "error");
                    } else {
                        handleResult(_coin, result);
                    }
                });
            }
            //end unspent
        }

    },
    "click .select-btc": function (event, template) {
        Session.set("currentcoin", 'BTC');
    },
    "click .select-ltc": function (event, template) {
        Session.set("currentcoin", 'LTC');
    },
    "click .select-kmd": function (event, template) {
        Session.set("currentcoin", 'KMD');
    },
    "click .btn-buymax": function (event, template){
        const coin = Session.get("currentcoin");
        const coin_price_str = 'price' + coin;
        var balance = Userdata.findOne({ coin: coin }) && parseFloat(Userdata.findOne({ coin: coin }).balance / numcoin).toFixed(8);
        var price = Number(Tradedata.findOne({ key: coin_price_str }) && Tradedata.findOne({ key: coin_price_str }).price / numcoin);
        var amount = 0;
        if(!balance){
            balance = 0;
        }
        if(!price){
            price = 0;
        }
        if(balance == 0 || price == 0){
            amount = 0;
        }else{
            amount = balance / price;
            amount = amount.toFixed(8);
        }
        template.find("#bntnbuyamount").value = amount;
        Session.set("selected_amount", amount);

    }
});
