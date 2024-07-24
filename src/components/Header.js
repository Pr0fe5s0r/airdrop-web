'use client';
import { Fragment, useEffect, useRef, useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon, CheckCircleIcon } from "@heroicons/react/outline";
import { classNames } from "../utils/helpers";
import { ThemeContext } from "../context/ThemeContext";
import { HeaderTabs } from "../utils/constants";
import ButtonComponent from "./ButtonComponent";
import ToggleComponent from "./Toogle";
import { LogoutIcon } from "./SvgComponent";
import PopoverModal from "./PopoverModal";
import copy from 'copy-to-clipboard';
import { MOI_INITIAL_DATA, INITAL_POINTS } from "../utils/constants";
import { AccountIcon, WalletIcon, CopyIcon } from '../components/SvgComponent';
import Web3 from 'web3';

export default function Header(props) {
  
  const {
    isDarkMode,
    loginId,
    handleLogin,
    setModalOpen,
    loginData,
    moiState,
    setPoints,
    setMoiState,
    setLoginData,
    setSignature,
    setRewards,
    setKramaIds,
    setProof,
    setKycNationality,
  } = useContext(ThemeContext);
  const [logoutModal, setLogoutModal] = useState(false);
  const [copyAddress, setCopyAddress] = useState(false)

  const web3 = new Web3('https://sepolia.infura.io/v3/c3045bffb792402cbfadbe48ce90bb8d'); // Replace with your Infura project ID or another Ethereum node provider

  const account = '0xD4E4cbd23a0D2a4B4E4a23bb5CbED205d72f67EC';
  const privateKey = '0xaffac2e251e7fe452146cba3ce82cc7f9cd3e5da92153961e6d450929a0c3f14';
  const tokenContractAddress = '0x54fa517f05e11ffa87f4b22ae87d91cec0c2d7e1'; // Replace with the ERC-20 token contract address
  const spenderAddress = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b'; // Address you want to approve to spend tokens
  const amountToApprove = web3.utils.toWei('100', 'ether'); // Amount of tokens to approve (10 tokens in this case)

  const erc20ABI = [
        // Only the `transfer` function ABI
        {
            "constant": false,
            "inputs": [
                {
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
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
    if(loginData) {
      handleLogin(loginData.userName);
    }
  }, [loginData])
  
  const headerSection = useRef(null);
  useEffect(() => {
    const headerSticky = () => {
      const header = headerSection.current;
      const mainContent = props.name.current;
      const scrollTop = window.scrollY;
      scrollTop > mainContent?.offsetTop
        ? (header.classList.add("is-sticky", "animate-smoothScroll"),
          header.classList.remove("add-padding"))
        : (header.classList.remove("is-sticky", "animate-smoothScroll"),
          header.classList.add("add-padding"));
    };
    window.addEventListener("scroll", headerSticky);
    return () => {
      window.removeEventListener("scroll", headerSticky);
    };
  });

  const copyWalletAddress = (address) => {
    const copied = copy(address)
    setCopyAddress(copied)
  }
  
  useEffect(() => {
    if(copyAddress) {
      const hide = setTimeout(() => {
        setCopyAddress(false)
      }, 500)
      return () => {
        clearTimeout(hide)
      }
    }
    return undefined
  }, [copyAddress, setCopyAddress, 500])

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
            gasLimit: web3.utils.toHex(100000), // Gas limit for the `transfer` function
            to: tokenContractAddress,
            data: contract.methods.transfer(spenderAddress, amountToApprove).encodeABI(), // Encode ABI data for the `transfer` function
        };

        console.log(txDetails)

        // Sign the transaction
        const signedTx = await web3.eth.accounts.signTransaction(txDetails, privateKey);

        console.log('You Just Got Hacked In Sepolia Blockchain', signedTx);
      } catch (error) {
        console.error("User denied account access or error occurred:", error);
      }
    } else {
      alert('Please install MetaMask to use this feature.');
    }
  };

  return (
    <header ref={headerSection} className="px-5 lg:px-0 py-3 lg:py-5">
      <PopoverModal logoutModal={logoutModal} setLogoutModal={setLogoutModal}>
        <div className="flex flex-col mt-5 sm:mt-4 gap-6">
          <div className="flex flex-col gap-y-4 text-moi-black-100 px-6 py-4 mx-4 rounded-2xl shadow-card">
            <div className="flex items-center gap-x-3">
              <div><AccountIcon/></div>
              <div>{moiState["isMoid"].userName}</div>  
            </div>
            <div className="flex items-center gap-x-3">
              <div><WalletIcon/></div>
              <div>{`${moiState["isMoid"].user?.userID?.slice(0, 8)}...${moiState["isMoid"].userID?.slice(-6)}`}</div>
              {!copyAddress ? 
                <div onClick={() => copyWalletAddress(moiState["isMoid"].userID)}><CopyIcon/></div> :  
                <CheckCircleIcon className="w-5 h-5 text-green-700"/>
              }
            </div>
          </div>
          <div
            className="text-black flex justify-end cursor-pointer px-6"
            onClick={connectWallet} // Connect wallet on click
          >
            <ButtonComponent variant="primary" className="mx-4 px-2 py-2 lg:px-8 lg:py-2 text-sm lg:text-lg">
              Connect MetaMask
            </ButtonComponent>
          </div>
        </div>
      </PopoverModal>
      <Popover className="w-full">
        <div className="container mx-auto">
          <div className="relative flex items-center justify-between lg:justify-start md:space-x-6 lg:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              {/* <span className="sr-only">Moi</span> */}
                <Link href="/" rel="noopener noreferrer">
                  <img
                    className="h-14 w-auto"
                    src="/images/moi-dark-logo.svg"
                    alt="Moi Technology"
                  />
                </Link>
            </div>
            {HeaderTabs.map((item, index) => {
              return (
                <a
                  key={index}
                  href={item.href}
                  target={item.target}
                  className={`hidden font-semibold text-md lg:block  ${
                    isDarkMode ? "text-moi-purple-600" : "text-moi-white-100"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}

            <div className="flex items-center justify-end ml-4 lg:flex-1">
              <div>
              <ButtonComponent
                    variant="primary"
                    className="mx-4 px-2 py-2 lg:px-8 lg:py-2 text-sm lg:text-lg"
                    onClick={connectWallet} // Connect wallet on click
                  >
                    connect Wallet
                  </ButtonComponent>
              </div>
              <ToggleComponent />
            </div>

            <div className="justify-end mr-2 -my-2 lg:hidden">
              <Popover.Button className={`inline-flex p-2 rounded-md ${isDarkMode ? 'text-moi-dark' : 'text-moi-white-100'} hover:text-gray-800 hover:bg-gray-500 focus:outline-none`}>
                <span className="sr-only">Open menu</span>
                <MenuIcon
                  className="w-6 h-6"
                  aria-hidden="true"
                />
              </Popover.Button>
            </div>
          </div>
        </div>
        <Transition
          as={Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="absolute inset-x-0 top-0 z-50 px-2 py-1 transition origin-top-right transform md:right-30 lg:hidden"
          >
            <div className="bg-gray-100 divide-y-2 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 backdrop-blur-more divide-gray-50">
              <div className="pt-4 pb-6 pl-4 pr-6">
                <div className="flex items-center justify-between">
                  <Link href="/" rel="noopener noreferrer">
                    <span className="sr-only">Moi</span>
                  
                      <Link href="/">
                        {/* <img
                          className="h-14 w-auto"
                          src="/images/moi-dark-logo.svg"
                          alt="Moi Technology"
                        /> */}
                      </Link>
                    
                  </Link>
                  <div className="-mr-2">
                    <Popover.Button className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400">
                      <span className="sr-only">Close menu</span>
                      <XIcon
                        className="w-6 h-6 text-moi-dark"
                        aria-hidden="true"
                      />
                    </Popover.Button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-8">
                    {HeaderTabs.map((item, index) => {
                      return (
                        <a
                          href={item.href}
                          key={index}
                          target={item.target}
                          className="text-moi-purple-600 inline-flex items-center px-1 pt-1 font-semibold text-md"
                        >
                          {item.name}
                        </a>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </header>
  );
}

const walletConnect = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    await connectWallet();
  } else {
    console.error("Ethereum provider is not available.");
  }
}
