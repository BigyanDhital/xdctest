const xdcHelper = require("./xdc.helper");

const send100XDC = async () => {
  console.log("STARTED");
  try {
    const { XDC } = await xdcHelper.generateWallet(); //{ address:"", privateKey:""}
    console.log("Generated wallet ", XDC);

    const sender = XDC.address;
    const privateKey = XDC.privateKey;
    const receiver = "0xec2ee92fac10e3a8857a88eff9f7534f05296631";

    const balance = await xdcHelper.getBalance(sender);
    console.log(`Sender balance ${sender}`, balance);

    const gasPrice = 3;
    const amount = 100;
    const txn = await xdcHelper.sendXDC(sender, receiver, gasPrice, amount, privateKey);
    console.log(txn);
  } catch (e) {
    console.log("send100XDC error ", e);
  }
};

send100XDC();
