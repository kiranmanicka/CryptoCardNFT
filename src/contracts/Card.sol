pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Card is ERC721{

    uint public _id=0;
    Creature[] public creatures;
    Battle[] public battles;
    
    struct Creature {
        string name;
        string bio;
        string imageURI;
        uint attackPoints;
        uint defensePoints;
        string specialMove;
        uint value;
    }
    
    struct Battle{
        address host;
        uint hostCreature;
    }
   

    constructor() ERC721('Card',"CARD") {
    }


    function mint(
    string memory name, 
    string memory bio,
    string memory imageURI,
    uint attackPoints,
    uint defensePoints,
    string memory specialMove) 
    public {
        Creature memory what = Creature({name:name,bio:bio,imageURI:imageURI
        ,attackPoints:attackPoints,defensePoints:defensePoints,specialMove:specialMove,value:2000000000000000});
        creatures.push(what);
        _mint(msg.sender, _id);
        _id=_id+1;
    }
    
    function getTokensByAddress(address to) public view returns(uint [] memory){
        uint balance= ERC721.balanceOf(to);
        uint[] memory tokensFromAddress= new uint[] (balance);
        uint x=0;
        for(uint i=0;i<_id;i++){
            if(ownerOf(i)==to){
                tokensFromAddress[x]=i;
                x++;
            }
        }
        return tokensFromAddress;
    }

    function createBattle(address host, uint tokenID )public{
        Battle memory battle= Battle({host:host, hostCreature:tokenID});
        battles.push(battle);
    }
    
    function joinBattle(uint battleID,uint tokenID) public returns(uint){
        Battle memory battle= battles[battleID];
        uint specialNumber= uint(creatures[tokenID].value/(creatures[battle.hostCreature].value+creatures[tokenID].value));
        uint random = uint(keccak256(abi.encodePacked(battleID,tokenID,block.timestamp,block.difficulty)))%100;
        if(random<=specialNumber){
            _transfer(ownerOf(battle.hostCreature),ownerOf(tokenID),battle.hostCreature);
            return battle.hostCreature;
        }else{
            _transfer(ownerOf(tokenID),ownerOf(battle.hostCreature),tokenID);
            return tokenID;
        }
    }
    

}

