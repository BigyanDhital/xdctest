const { Wallet, providers, getDefaultProvider, utils } = require("ethers");

const EthereumTx = require("ethereumjs-tx");
const XDC3 = require("xdc3");

const XINFIN_URL = "https://rpc.apothem.network"; //testnet
let xdc3Client = new XDC3(XINFIN_URL);

const generateAddressXDC = (mnemonics) => Wallet.fromMnemonic(mnemonics);

const getBalance = async (address) => {
  try {
    let balance = await xdc3Client.eth.getBalance(address);
    balance = balance / 1e18;
    return { error: false, balance };
  } catch (e) {
    console.log("Balance fetch error XDC", e);
    return { error: true, balance: 0 };
  }
};
const generateWallet = async () => {
  const mnemonics = "exile tragic maple bring seek rude guitar you version bundle era boat";

  //   const btcWallet = generateAddressBTC(mnemonics);
  const xdcWallet = generateAddressXDC(mnemonics);

  const wallet = {
    // BTC, ETH , BCH ...
    XDC: {
      address: xdcWallet.address,
      privateKey: xdcWallet.privateKey,
    },
  };
  return wallet;
};

sendXDC = async (from, to, gasPrice = 2, amount, privateKey) => {
  console.log(`---------------sending XDC---------------`, { from, to, gasPrice, amount, privateKey });
  try {
    const nonce = await xdc3Client.eth.getTransactionCount(from, "pending");
    const txParams = {
      nonce: nonce,
      gasLimit: 21000,
      gasPrice: gasPrice,
      value: xdc3Client.utils.toHex(amount.toString()),
      to: to,
    };
    console.log("txParams", txParams);

    const tx = new EthereumTx(txParams);
    console.log("tx: ", tx);
    tx.sign(Buffer.from(privateKey.replace("0x", "")), "hex");
    console.log("Transaction signed!");
    const serializedTx = tx.serialize();
    const transactionData = "0x" + serializedTx.toString("hex");
    const txDetails = await xdc3Client.eth.sendSignedTransaction(transactionData);
    console.log("TRANSACTION SEND SUCCESSFUL : ", txDetails);
    return txDetails;
  } catch (e) {
    console.log("XDC SEND UNSUCCESSFUL ", e);
  }
};

const send100XDC = async () => {
  console.log("STARTED");
  try {
    const { XDC } = await generateWallet();
    console.log("Generated wallet ", XDC);
    const sender = XDC.address;
    const receiver = "0xec2ee92fac10e3a8857a88eff9f7534f05296631";
    const balance = await getBalance(sender);
    console.log(`Sender balance ${sender}`, balance);
    const txn = await sendXDC(sender, receiver, 2, 100, XDC.privateKey);
    console.log(txn);
  } catch (e) {
    console.log("send100XDC error ", e);
  }
};

send100XDC();
