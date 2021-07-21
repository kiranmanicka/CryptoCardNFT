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

    mapping(address=> mapping(uint=>uint)) public _ownedTokens;
    uint public _id=0;
    Creature[] public creatures;

   

    constructor() ERC721('Card',"CARD") {
    }

    function addTokenToOwner(address to,uint tokenID) private{
        uint length=ERC721.balanceOf(to);
        _ownedTokens[to][length]=tokenID;
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
        addTokenToOwner(msg.sender, _id);
        _mint(msg.sender, _id);
        _id=_id+1;
    }
    
    function getTokensByAddress(address to) public view returns(uint [] memory){
        uint balance= ERC721.balanceOf(to);
        uint[] memory tokensFromAddress= new uint[] (balance);
        for(uint i=0;i<balance;i++){
            tokensFromAddress[i]=(_ownedTokens[to][i]);
        }
        return tokensFromAddress;
        
    }
    
    function modifiedTransfer(
        address from,
        address to,
        uint256 tokenId
    ) public {
        _transfer(from, to, tokenId);
    }

}

