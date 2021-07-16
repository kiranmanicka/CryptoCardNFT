import React, { Component, useEffect,useState } from 'react';
import './App.css';

import {Button,TextField} from '@material-ui/core'
import Web3 from 'web3';


function App(){
  const [address,setAddress]=useState()
  const [balance,setBalance]=useState()
  var web3=null

   const loadWeb3=async ()=>{
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  useEffect(async()=>{
    await loadWeb3()
    await loadBlockchainData()
  },[])
  
  const loadBlockchainData=async()=>{
    web3=window.web3

    web3.eth.getAccounts().then(accounts=>{
      setAddress(accounts[0])
      setUserBalance(accounts[0])
    })
    
  }



  const setUserBalance = async(fromAddress)=>{
      await web3.eth.getBalance(fromAddress).then(value=>{
        const credit=web3.utils.fromWei(value, 'ether')
        setBalance(credit);
      })
  }

  const sendTransaction= async(e)=>{
    web3=window.web3
    e.preventDefault();
    const amount=e.target[0].value
    const recipient= e.target[1].value
    await web3.eth.sendTransaction({
      from:address,
      to: recipient,
      value: web3.utils.toWei(amount,'ether'),
    })
    setUserBalance(address)
  }

  const mintToken=(e)=>{
    e.preventDefault();
    console.log('wassup')
  }


    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Welcome to a dectralized Application
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{address}</span></small>
            </li>
        </ul>
        </nav>
        
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {address ? (
                  <>
                  <p>Balance: {balance}</p>
                  </>
                ): null}
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>

                <form onSubmit={e => sendTransaction(e)}>
                <TextField
                  required
                  label="Amount"
                  inputProps={{ step: "any" }}
                  type="number"
                  variant="filled"
                />
                <TextField required label="Recipient Address" variant="filled" />
                <Button
                  style={{ margin: "15px" }}
                  type="submit"
                  variant="outlined"
                  color="default"
                >
                Send Ethereum
                </Button>
                
                </form>
                <form onSubmit={e=>mintToken(e)}>
                <TextField required label="Choose a Color" variant="filled"/>
                <Button
                  style={{ margin: "15px" }}
                  type="submit"
                  variant="outlined"
                  color="default"
                >
                Mint
                </Button>
                
                </form>
              </div>
              
            </main>
          </div>
        </div>
      </div>
    );
  
}

export default App;
