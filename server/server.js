const express = require('express');
const app = express();
const puppeteer = require('puppeteer');

const PORT = 3000;

app.use(express.static('../client/dist'));
app.use(express.json());

const url = 'https://jsm209.github.io/EasyDD/';


const commonWords = 'HANDS, APES, STOP, A, ABOUT, ALL, ALSO, AN, AND, AS, AT, BE, BECAUSE, BUT, BY, CAN, COME, COULD, DAY, DO, EVEN, FIND, FIRST, FOR, FROM, GET, GIVE, GO, HAVE, HE, HER, HERE, HIM, HIS, HOW, IF, IN, INTO, IT, ITS, JUST, KNOW, LIKE, LOOK, MAKE, MAN, MANY, ME, MORE, MY, NEW, NO, NOT, NOW, OF, ON, ONE, ONLY, OR, OTHER, OUR, OUT, PEOPLE, SAY, SEE, SHE, SO, SOME, TAKE, TELL, THAN, THAT, THE, THEIR, THEM, THEN, THERE, THESE, THEY, THING, THINK, THIS, THOSE, TIME, TO, TWO, UP, USE, VERY, WANT, WAY, WE, WELL, WHAT, WHEN, WHICH, WHO, WILL, WITH, WOULD, YEAR, YOU, YOUR, STOCK, HOLD, HOLDING, HOLDIN, SELL, SELLING, SELLIN, HF, DIP, DIPS, RIP, RIPS, STRONG, WEAK, MOON, WEEK, MONTH, SEC, LGBT, LGBTQ, GAY, FAG, FUCK, FUCKIN, FUCKING, AM, AF, SHIT, TOO, ARE, SQUEEZ, ADD, AD, ROCKET, RIGHT, WRONG, AYOLO, RETARD, FOR, IS, DAYS, WEEK, WEEKS, MONTH, MONTHS, BEFORE, AFTER, START, FINISH, MELVIN, COHEN, TWITTER, FB, PT, SL, PE, MAYBE, SHORTS, LADDER, MARKET, SHILL, SUITS, CITADE, CITADEL, ROBINHOOD, TD, AMERITRADE, AMERICA, WEBULL, BUY, STILL, AS, TASER, CHINA, BIDEN, HARRIS, TRUMP, REDDIT, DTC, DON, ED, ET, MNT, STOP, HANDS, PANTS, DFV, APES, HAND, PAPER, DIAMOND, DIAMON, JPM, CALL, CALLS, OPTIONS, OPTION, SHARES, PUT, LEAVING, LEAVIN, TOMORROW, TOMORR, BOYS, BOIS, BOY, BOI, GANG, ING, NEWS, CNBC, MSNBC, FOX, USA, BS, UNTIL, MANIPU, NEVER, BUYING, FAKE, VOLUME, IM, MM, LONG, CIA, FBI, OW, TL, DONT, REALLY, LINE, LOT, BACK, BACKED, BACKING, TOGETH, BIG, DR, BOUGHT, WALL, STREET, WALLSTREET, HEDGE, FUND, GOING, STAY, LATION, LIFE, DOWN, LOW, AM, PM, LET, SUPPLY, DEMAND, HIGH, NEXT, TRADE, OFF, ST, LEAST, MOST, ER, ERROR, BANG, SE, LY, MONEY, BABY, MOASS, NOTHING, NOTHIN, INTERE, READ, MEDIA, RE, QNX, IOS, VWAP, OP, GAMEST, CORP, HLDG, CO, NYSE, NYSEG, AMA';

async function scrape() {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  await page.$eval('#topTickerCount', el => el.value = 10);
  await page.$eval('#maxPages', el => el.value = 100);

  const inputs = await page.$('#excluded');
  await inputs.type(commonWords);
  const addTickerButton = await page.$('#addTickers');
  await addTickerButton.click();

  const generateButton = await page.$('#generate');
  await generateButton.click();

  await page.waitFor(100000);
  console.log('Wait Over');

  const tickers = await page.$$('#tickers div div');

  const results = [];

  for (let ticker of tickers) {
    const text = await ticker.$eval('h3', el => el.textContent);
    console.log(text);
    results.push(text);
  }
  console.log('Retrieved ALL Tickers');

  await browser.close();

  return results;
}

app.get('/scrape', (req, res) => {
  scrape()
    .then((data) => {
      res.send(data);
    });
});

app.listen(PORT, () => {
  console.log('serving up now at ' + JSON.stringify(PORT));
});