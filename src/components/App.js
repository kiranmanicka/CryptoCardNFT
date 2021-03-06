import React, { Component, useEffect,useState } from 'react';
import './App.css';

import {Button,TextField} from '@material-ui/core'
import Web3 from 'web3';

import Card from '../abis/Card.json'



function App(){
  const [address,setAddress]=useState()
  const [balance,setBalance]=useState()
  const [contract,setContract]=useState()
  const [totalSupply,setTotalSupply]=useState()
  const [creatures,setCreatures]=useState([])
  const [imageURI,setImageURI]=useState(null)
  const [webNew,setWeb3]=useState()
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
    setWeb3(window.web3)
  }

  useEffect(async()=>{
    await loadWeb3()
    await loadBlockchainData()
  },[])
  
  const loadBlockchainData=async()=>{

    const result=[]
    web3=window.web3

    web3.eth.getAccounts().then(accounts=>{
      setAddress(accounts[0])
      setUserBalance(accounts[0])
    })

    const networkID=await web3.eth.net.getId()
    const networkData=Card.networks[networkID]
    if(networkData){
      const abi=Card.abi
      const address=networkData.address
      const myContract=new web3.eth.Contract(abi,address)
      setContract(myContract)
      const totalSupply = await myContract.methods._id().call()
      
      for (var i=0;i<totalSupply;i++){
          result.push( await myContract.methods.creatures(i).call())
      }
      console.log(result)
      setCreatures(result)
    }else{
      window.alert('smart contract not deployed to network')
    }
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
    const name=e.target[0].value
    const bio=e.target[1].value
    const attackPoints=e.target[2].value
    const defensePoints=e.target[3].value
    const specialMove=e.target[4].value

    contract.methods.mint(name,bio,imageURI,attackPoints,defensePoints,specialMove)
    .send({from:address})
    .once('receipt',(receipt)=>{
      setCreatures([...creatures,{name,bio,imageURI,attackPoints,defensePoints,specialMove}])
      console.log('successful')
    })

    
  }

  const test=async()=>{
    //const creature= await contract.methods.creatures(0).call()
    const totalTokens= await contract.methods._id().call()
    for (var i=0;i<totalTokens;i++){
      const length = await contract.methods.creatures(i).call()
      console.log(length)
    }
  }



  const fileChosen=(e)=>{
      let files=e.target.files
      console.log(files)
      let reader= new FileReader()
      reader.readAsDataURL(files[0])
      reader.onload=(e)=>{
        
        const dataURI=e.target.result
        setImageURI(dataURI)
      }
      
  }

  const buyToken=async(creature)=>{
    const location = creatures.indexOf(creature)
    console.log(location)
    const creat = await contract.methods.creatures(location).call()
    console.log(creat)
    const value=creat.value
    console.log(value)
    const creatureAddress=await contract.methods.ownerOf(location).call()
    console.log(creatureAddress)
    await contract.methods.transferToken(creatureAddress,address,location).send({from:address});
    console.log('working fine here')
    await webNew.eth.sendTransaction({
      from:address,
      to: creatureAddress,
      value: value,
    })
    console.log('transaction complete')
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
            Magical Cards
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
                <div class="row text-center">
        
                </div>
                <input type='file' name='file' onChange={(e)=>{fileChosen(e)}}/>
              </div>
              {imageURI&& <img src={imageURI} height="200" />}
                <form onSubmit={e=>mintToken(e)}>
              <TextField required label="Name" variant="filled" />
              <TextField required label="Bio" variant="filled" />
              <TextField required label="image file" variant="filled" />
              <TextField required label="attack points" type="number" variant="filled" />
              <TextField required label="defense points" type="number" variant="filled" />
              <TextField required label="special move" variant="filled" />
              <Button
                  style={{ margin: "15px" }}
                  type="submit"
                  variant="outlined"
                  color="default"
                >Mint Creature</Button>
              </form>
              <button onClick={test}>test</button>

              <div className="row text-center">
            { creatures.map((creature, key) => {
              return(
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{ backgroundColor:'white' }}></div>
                  <div>
                    <h1>{creature.name}</h1>
                    <h2>{creature.value}</h2>
                  </div>
                  <button onClick={()=>{buyToken(creature)}}>Buy Token</button>
                </div>
              )
            })}
          </div>
              
              
            </main>
          </div>
        </div>
      </div>
    );
  
}

export default App;
