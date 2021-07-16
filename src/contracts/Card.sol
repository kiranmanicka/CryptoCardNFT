pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Card is ERC721{

    string[] public colors;
    mapping(string=> bool) _colorExists;
    uint _id=0;

    constructor() ERC721('Card',"CARD") {
    }

    function mint(string memory _color) public {
        require(!_colorExists[_color]);
        colors.push(_color);
        _mint(msg.sender, _id);
        _id=_id+1;
        _colorExists[_color]=true;
    }

}

