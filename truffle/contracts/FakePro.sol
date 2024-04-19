// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

contract FakePro {
        
    struct State{
        string owner;
        address person;
        string date;
        bool ispay;
    }
    
    struct Product{
        address creator;
        string productName;
        uint256 cost;
        uint256 productId;
        string date;
        uint256 totalStates;
    }
    
    mapping(string => Product) allProducts;
    mapping (uint256 => State) positions;
    uint256 items=1;
    
    function concat(string memory _a, string memory _b) public pure returns (string memory){
        return string(bytes.concat(bytes(_a), " ", bytes(_b)));
    }
    
    function newItem(string memory _text, uint256 _cost, string memory info, string memory _date) public returns (uint256) {
        require(allProducts[_text].totalStates==0,"Already this product exists");
        Product memory newITem = Product({creator: msg.sender, totalStates: 1, productName: _text, cost: _cost, productId: items, date: _date});
        allProducts[_text]=newITem;
        State memory newState = State({person: payable(msg.sender), owner: info, date: _date, ispay: true});
        positions[ allProducts[_text].totalStates-1 ]=newState;
        items = items+1;
        return (items-1);
    }

    function getPaymentStatus(string memory _text) public view returns(bool){
        return positions[allProducts[_text].totalStates-1].ispay;
    }

    function getPayDetais(string memory _text) public view returns(bool, address, uint256){
        return (
            positions[allProducts[_text].totalStates-1].ispay,
            positions[allProducts[_text].totalStates-2].person,
            allProducts[_text].cost
        );
    }

    function pay(string memory _text) public payable{
        positions[allProducts[_text].totalStates-1].ispay=true;
        payable(positions[allProducts[_text].totalStates-2].person).transfer(msg.value);
    }

    function getLatestOwner(string memory _text) public view returns (string memory){

        return positions[allProducts[_text].totalStates-1].owner;

    }

    function getTotalStates(string memory _text) public view returns (uint256){
        return allProducts[_text].totalStates ;
    }
    
    function addState(string memory _text, string memory info, address _person, string memory _date) public returns (string memory) {
        require(positions[allProducts[_text].totalStates-1].person==msg.sender,"Ensure your account address");
        
        State memory newState = State({person: payable(_person), owner: info, date: _date, ispay: false});
        
        positions[ allProducts[_text].totalStates ]=newState;
        
        allProducts[_text].totalStates = allProducts[_text].totalStates +1;

        return info;
    }
    
    function searchProduct(string memory _text) public view returns (string memory) {

        require(allProducts[_text].productId<items && allProducts[_text].productId>0,"No data available");
        string memory output="";
        
        for (uint256 j=0; j<allProducts[_text].totalStates; j++){
            output=concat(output, positions[j].owner);
            output=concat(output, ":");
            output=concat(output, positions[j].date);
            output=concat(output, "::");
        }
        return output;
        
    }
    
}