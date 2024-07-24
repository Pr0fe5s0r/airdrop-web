import React, { useContext, useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { ThemeContext } from "../context/ThemeContext";
import Header from "./Header";
import Footer from "./Footer";
import axios from 'axios';
const contract = require("../artifacts/contract.json");
require("dotenv").config();
const { ethers } = require("ethers");

const inter = Inter({ subsets: ["latin"] });

const getAllocationProof = async (userid) => {
  const url = 'https://api.moinet.io/moi-id/digitalme/checkForKYC';
  const headers = {
    'Content-Type': 'application/json',
  };
  const data = {
    defAddr: userid,
    nameSpace: 'validator',
  };

  try {
    const address = "0x0Be68caD700DA3Cc1a9135ef5C50843940e4b886";
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_URL
      );
      const signer1 = new ethers.Wallet(
        process.env.NEXT_PUBLIC_PRIV_KEY,
        provider
      );
      const moiContract = new ethers.Contract(
        address,
        contract["abi"],
        signer1
      );
    const txn = await moiContract.getAllocationProofsOf(
      userid,
      0x00
    )
    return txn
     
  } catch (error) {
    return ([])
  }
};
const makeKycRequest = async (userid) => {
  const url = 'https://api.moinet.io/moi-id/digitalme/checkForKYC';
  const headers = {
    'Content-Type': 'application/json',
  };
  const data = {
    "defAddr": userid,
    "nameSpace": 'validator',
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data
    
  } catch (error) {
    return false
    //console.error(error);
    
  }
};

export default React.forwardRef(function Layout({ children, data }, ref) {
  const { setMoiState, loginData, loginId, isDarkMode, setPoints, moiState, setRewards, rewards, kramaIds, setKramaIds, setLoading, setProof, setKycNationality, authToken } = useContext(ThemeContext);

  // const getEligibility = async () => {
  // const proof = await getAllocationProof(loginData.user.userID)
  
  // setProof(proof)
  //   let response = await fetch(`/api/moi?userId=${loginData.user.userID}&userName=${loginData.userName}&token=${authToken.datToken}`)
    
  //   let data = await response.json();
  //   const avatarsCreated = data.interactions.data.filter(function (txn) {
  //     try {
  //       let namespace = loginData.iome.utils.mDecode(txn.namespace)
  //       return (namespace.includes("Avatar") &&
  //       txn.action == "Created");
  //     } catch (error) {
  //       return ;
  //     }
  //   })

  //   const avatarsScanned = data.interactions.data.filter(function (txn) {
  //     try {
  //       let namespace = loginData.iome.utils.mDecode(txn.namespace)
  //       return (namespace.includes("Avatar") &&
  //       txn.action == "Scanned");
  //     } catch (error) {
  //       return ;
  //     }
  //   })

  //   const appsCreated = data.interactions.data.filter(function (txn) {
  //     try {
  //       let namespace = loginData.iome.utils.mDecode(txn.namespace)
  //       return (namespace.includes("App") &&
  //       txn.action == "Created");
  //     } catch (error) {
  //       return ;
  //     }
  //   })

  //   const appsJoined = data.interactions.data.filter(function (txn) {
  //     try {
  //       let namespace = loginData.iome.utils.mDecode(txn.namespace)
  //       return (namespace.includes("App") &&
  //       txn.action == "Joined");
  //     } catch (error) {
  //       return ;
  //     }
  //   })

  //   let kyc = data.kyc.code == 200 ? true : false
  //   let phone_no = data.phone_no.code == 200 ? true : false
  //   if (phone_no){
  //     phone_no = data.phone_no.data.result.givenAttributes.phone.verified
  //   }
  //   let email = data.email.code == 200 ? true : false
  //   if (email){
  //     email = data.email.data.result.givenAttributes.email.verified
  //   }
  //   //const twitter = data.twitter ? data.twitter.data.level : 0
  //   const telegram = data.telegram ? data.telegram.data.level : 0
  //   const discord = data.discord ? data.discord.data.level : 0
    
  //   const validator_nodes_may = data.interactions.data.filter(function (txn) {
  //     if (txn.namespace == "MOI Net" &&
  //         txn.attr == "Validator" &&
  //         txn.action == "Created" &&
  //         parseInt(txn.instant) < 1650470399)
  //         return txn
  //   })
  //   let rewards_ = 0
   
  //    data.kramaID.filter(async function (ids) {
  //     let krama_response = await fetch(`/api/kramaId?kramaId=${ids.kramaID}`)
  //     let krama_data = await krama_response.json()
  //     if (krama_data.rewards.data.total_token_summary) {
  //      rewards_ = rewards_ +  parseInt(krama_data.rewards.data.total_token_summary)
  //       await setRewards(rewards_)
       
  //       await setKramaIds((prev)=>
  //      [...prev,
  //       {
  //       kramaId: ids.kramaID,
  //       rewards: parseInt(krama_data.rewards.data.total_token_summary)
  //      }
  //     ])
  //   }
  //   else return;
  //  })
  //  if (kyc) {
  //   let response = await makeKycRequest(loginData.user.userID)
  //   console.log(response)
  //   response && setKycNationality(response.kycMethod.nationality)
  //   if (!response) {
  //     kyc = false
  //   }
  //  }
    
  //   setMoiState((prevData) => ({
  //     ...prevData,
  //     phone_no: phone_no,
  //     email: email,
  //     kyc: kyc,
  //     validator_nodes: data.validator_nodes.length,
  //     validator_nodes_may: validator_nodes_may.length,
  //     twitter: 0,//twitter,
  //     telegram: telegram,
  //     discord: discord,
  //     interactions: data.interactions.data.length,
  //     createdApp: appsCreated.length,
  //     partApp: appsJoined.length,
  //     createdAvatar: avatarsCreated.length,
  //     scannedAvatar: avatarsScanned.length
  //   }));
  // };


  useEffect (() => {
    setLoading(false)
    setPoints({
      moid: moiState["isMoid"] ? 1 : 0,
      phone_no: moiState["phone_no"] ? 2 : 0,
      email: moiState["email"] ? 2 : 0,
      kyc: moiState["kyc"] ? 5 : 0,
      validator_nodes: moiState["validator_nodes"] * 10,
      validator_nodes_may: moiState["validator_nodes_may"] * 10,
      twitter: moiState["twitter"] * 10,
      telegram: moiState["telegram"] * 10,
      discord: moiState["discord"] * 10,
      kramaIds: kramaIds.length * 10,
      interactions: moiState["interactions"] * 5,
      createdApp: moiState["createdApp"] * 50,
      partApp: moiState["partApp"] * 5,
      createdAvatar: moiState["createdAvatar"] * 10,
      scannedAvatar: moiState["scannedAvatar"] * 5,
    });
  }, [moiState, kramaIds])

  // useEffect(() => {
  //   loginId && getEligibility();
  //   loginId && setLoading(true)
  // }, [loginId]);

  useEffect(() => {
    console.log(kramaIds.length)
    setMoiState((prev) => ({
      ...prev,
      kramaId: kramaIds.length
    }))
    // setPoints((prev) => ({
    //   ...prev,
    //   kramaId: kramaIds.length * 10
    // }))
  }, [kramaIds])

  return (
    <>
    <div  className={`p-auto bg-fixed bg-no-repeat ${isDarkMode ? "bg-hero-section bg-moi-white-600" : "bg-main-bg bg-[#13162e]"}`}>
      <Header name={ref}/>
      <div
        ref={ref}
        // className={`p-auto bg-fixed  bg-no-repeat ${isDarkMode ? "bg-hero-section bg-moi-white-600" : "bg-moi-black-300"}`}
      >
        <main className={`relative ${inter.className}`}>{children}</main>
      </div>
      </div>
      <Footer />
    </>
  );
});