pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Card is ERC721{

     struct Creature{
        string name;
        string bio;
        string imageURI;
        uint attackPoints;
        uint defensePoints;
        string specialMove;
    }

    uint public _id=0;
    Creature[] public creatures;
    mapping (uint => address) owners;

   

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
        Creature memory what = Creature(name,bio,imageURI,attackPoints,defensePoints,specialMove);
        creatures.push(what);
        _mint(msg.sender, _id);
        owners[_id]=msg.sender;
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
    

}

