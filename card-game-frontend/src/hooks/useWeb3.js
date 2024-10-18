// src/hooks/useWeb3.js
import { useEffect, useState } from 'react';
import { ethers } from "ethers";

export function useWeb3() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  
  
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          // Create a new Web3Provider instance from ethers.js
          const web3Provider = new ethers.BrowserProvider(window.ethereum); // Corrected line
          // Request accounts and set the default account
          web3Provider.send("eth_requestAccounts", []).then(accounts => setAccount(accounts[0]));
          
          const signer = web3Provider.getSigner();
          setProvider(web3Provider);
          setSigner(signer);
          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
          });
          
          // Listen for network changes
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        } catch (error) {
          console.error('Error connecting to Web3', error);
        }
      } else {
        console.error('No Ethereum provider found. Install MetaMask.');
      }
    };
    
    initWeb3();
  }, []);
  return { provider, signer, account };
}
