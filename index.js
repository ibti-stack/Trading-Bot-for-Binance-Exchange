import Binance from "node-binance-api";


//Initialization of Binance Exchange
const binance = new Binance().options({
    APIKEY: "PASTE YOUR BINANCE ACCOUNT API KEY",
    APISECRET: "PASTE YOUR BINANCE ACCOUNT SECRET KEY"
});



var alreadyBought = false;
var btcPrice;    //variable for current price

let btcBuyPriceStore;
let btcSellPriceStore;

var additionFactor = 50;      //SELLING CONDITION
var finalAdditionFactor;             

var subtractionFactor = 40;         //BUYING CONDITION  AFTER SELLING
var finalSubtractionFactor = 0;


         //Below fundtion is going to BUY the coin at CURRENT PRICE
            async function buyOrder() {
                try {
                    let quantity = 0.0009;
                    const response =  await binance.marketBuy("BTCUSDT", quantity);
                    console.log("Yahoooo I BAUGHT it.....");
                    alreadyBought = true;
                    btcBuyPriceStore = response.fills[0].price;
                    finalAdditionFactor = parseInt(btcBuyPriceStore) + additionFactor;
                    return console.log(response);
                }

                catch(e) {
                    console.log(e);
                }
               }
    
            buyOrder();

//This below function is goin to check the price after every 2 seconds and buy and sell it at mentioned conditions.
function repeat() {

        console.log("          ");
        async function getPrice() {

            try {
                binance.prices('BTCUSDT', (error, ticker) => {
                btcPrice = ticker.BTCUSDT;
                console.log("The CURRENT PRICE of BTC:  ", btcPrice);
                return btcPrice;
            });
            }
            catch(e) {
                console.log(e);
            }
            
        }

        getPrice();
       
        


               if(btcPrice < finalSubtractionFactor && !alreadyBought) {

                console.log("BUAGHT IT AFTER DOWN");
    
                async function buyOrder() {
                    try {
                        alreadyBought = true;
                        let quantity = 0.0009;
                        const response =  await binance.marketBuy("BTCUSDT", quantity);
                        console.log("Bought it");
                        btcBuyPriceStore = response.fills[0].price;
                        finalAdditionFactor = parseInt(btcBuyPriceStore) + additionFactor;
                        return console.log(response);
                    }
    
                    catch(e) {
                        console.log(e);
                    }
                   }
        
                    buyOrder();
             
            }


       
              
           else if(btcPrice > finalAdditionFactor  && alreadyBought) {

            
               async function sellOrder() {

                try {
                    alreadyBought = false;
                    let quantity = 0.0009;
                    const response =  await binance.marketSell("BTCUSDT", quantity);
                    console.log("I SOLD IT............");
                    btcSellPriceStore = response.fills[0].price;
                    finalSubtractionFactor = parseInt(btcSellPriceStore) - subtractionFactor;
                    return console.log(response);
                }
    
                catch(e) {
                    console.log(e);
                }
               }

                sellOrder();
            
           }


          

        
           else {
            console.log("Neither Buying Nor Selling........");
            
        }
        
        console.log("My bought Price was",btcBuyPriceStore);
        console.log("My sold Price was", btcSellPriceStore);
        console.log("The BOT will SELL BTC at:", finalAdditionFactor);
        console.log("The BOT will BUY BTC at:", finalSubtractionFactor);
       
        setTimeout(repeat,2000);
   
    
}

repeat();