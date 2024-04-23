import { ethers } from "ethers";
import ERC20_ABI from "./erc20.abi.json" assert { type: "json" };

const provider = new ethers.providers.JsonRpcProvider(
  "http://117.4.240.104:8545"
);

const address = "0x4ed6f5014c066E1cBc132D11a252636733bc926C";
const toAddress = "0x51a6ED422389e66BBfB4921CA1F31397a8b98be3";
const erc20Address = "0x1198290bf1dC4d257a6A30518C640C29e961C41e";
const privateKey =
  "0xe28f76b3bbc7a8ea9c6663e51d5ef59b4bc68a16bc76fda71f1aeeaddd73e244";

async function getBlance() {
  const balance = await provider.getBalance(toAddress);
  console.log(ethers.utils.formatEther(balance));
}

async function getTransaction() {
  const tx = await provider.getTransaction(
    "0xd40b3418b5117acb1053173cbd2f733dbff5c6852d4eb2971a01e57f103f93d1"
  );
  console.log(tx);
}

async function getBlock() {
  const block = await provider.getBlock(1);
  console.log(block);
}

async function sendTransaction() {
  const amount = ethers.utils.parseEther("0.1");
  const wallet = new ethers.Wallet(privateKey, provider);
  const tx = await wallet.sendTransaction({
    to: toAddress,
    value: amount,
  });
  console.log(tx);
}

async function sendERC20Transaction() {
  const signer = new ethers.Wallet(privateKey, provider);
  const erc20 = new ethers.Contract(erc20Address, ERC20_ABI, provider);
  // check erc20 token balance of address
  const balance = await erc20.balanceOf(toAddress);
  console.log(ethers.utils.formatEther(balance));

  // send 0.0000000001 erc20 token to toAddress
  //   const amount = ethers.utils.parseUnits("0.0000000001", 18);
  //   const tx = await erc20.connect(signer).transfer(toAddress, amount);
  //   console.log(tx);
}
