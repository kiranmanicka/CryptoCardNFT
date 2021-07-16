pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Card is ERC721{

     struct Token{
        uint tokenID;
        address ownerAddress;
        string bio;
        uint attackPoints;
        uint defensePoints;
        string specialMove;
    }

    string[] public colors;
    mapping(string=> bool) _colorExists;
    uint public _id=0;
    mapping (address=>bool) ownerExists;
    mapping(address=>uint[]) public  ownerNFT;

   

    constructor() ERC721('Card',"CARD") {
    }

    function mint(string memory _color) public {
        require(!_colorExists[_color]);
        colors.push(_color);
        _mint(msg.sender, _id);
        if(ownerExists[msg.sender]){
            ownerNFT[msg.sender].push(_id);
        }else{
            ownerNFT[msg.sender].push(_id);
        }
        _id=_id+1;
        _colorExists[_color]=true;
    }

}

