require('dotenv').config();
const TronWeb = require('tronweb');

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  privateKey: process.env.PRIVATE_KEY
});

const mainWallet = process.env.MAIN_WALLET;
const minAmount = parseInt(process.env.MIN_AMOUNT || "1000000"); // default 1 TRX in sun
const fromAddress = tronWeb.defaultAddress.base58;

async function forwardFunds() {
  try {
    const balance = await tronWeb.trx.getBalance(fromAddress);
    console.log(`[Wallet] Balance: ${balance / 1e6} TRX`);

    if (balance > minAmount + 100000) { // Leave some sun for fees
      const amountToSend = balance - 100000;
      const tx = await tronWeb.trx.sendTransaction(mainWallet, amountToSend);
      console.log(`[✅] Sent ${amountToSend / 1e6} TRX to ${mainWallet}\nTX ID: ${tx.txid}`);
    } else {
      console.log('[ℹ️] Not enough balance to forward.');
    }
  } catch (err) {
    console.error('[❌] Error:', err.message);
  }
}

setInterval(forwardFunds, 5000); // Check every 5 seconds
