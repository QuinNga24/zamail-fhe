// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

// Required imports (kept exactly as requested)
import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

// Additional FHE types we will use for encrypted content
// We use euint256 for encrypted message handles
import {euint256, externalEuint256} from "encrypted-types/EncryptedTypes.sol";

/// @title Zamail - a minimal mail dapp using fhevm primitives (Sepolia)
/// @notice Register an email (xxx@zamail.com) for 0.001 ETH. Each wallet can register exactly one email.
///         Send mail (encrypted) costs 0.0001 ETH. Mail content is provided as external encrypted values
///         (handled by the Gateway / coprocessors). Contract stores handles (bytes32) pointing to ciphertexts.
/// @dev This contract demonstrates how to integrate FHE handles and ACL grants.
///      Frontend must provide external encrypted inputs + attestation when sending messages.
contract Zamail is SepoliaConfig {

    uint256 public constant REGISTER_FEE_WEI = 1e15; // 0.001 ETH = 0.001 * 1e18 = 1e15 wei
    uint256 public constant SEND_MAIL_FEE_WEI = 1e14; // 0.0001 ETH = 1e14 wei

    // email string (public) -> owner
    mapping(string => address) public emailOwner;
    // owner address -> email string (empty if none)
    mapping(address => string) public ownerEmail;
    // inbox: owner -> array of message handles (bytes32)
    mapping(address => bytes32[]) private inbox;
    // outbox: owner -> array of message handles
    mapping(address => bytes32[]) private outbox;

    // Events
    event EmailRegistered(address indexed owner, string email);
    event MailSent(address indexed from, address indexed to, bytes32 handle);
    event Withdrawal(address indexed to, uint256 amount);

    /// @notice Admin owner
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    /// @notice Register an email address (must be unique). Payable: 0.001 ETH
    /// @param email The email string, e.g. "alice@zamail.com"
    function registerEmail(string calldata email) external payable {
        require(msg.value == REGISTER_FEE_WEI, "Must send exact 0.001 ETH");
        require(bytes(email).length > 0, "Email cannot be empty");
        require(emailOwner[email] == address(0), "Email already taken");
        require(bytes(ownerEmail[msg.sender]).length == 0, "Sender already has an email");

        emailOwner[email] = msg.sender;
        ownerEmail[msg.sender] = email;

        emit EmailRegistered(msg.sender, email);
    }

    /// @notice Send an encrypted mail to a recipient identified by email.
    ///         The mail content is provided as an external encrypted value (externalEuint256) with attestation bytes.
    /// @param recipientEmail recipient's email string (must be registered)
    /// @param externalContent the external encrypted content handle submitted by the frontend (attested by coprocessors)
    /// @param attestation signatures/attestation bytes from the coprocessors for the external value
    function sendMail(
        string calldata recipientEmail,
        externalEuint256 externalContent,
        bytes calldata attestation
    ) external payable {
        require(msg.value == SEND_MAIL_FEE_WEI, "Must send exact 0.0001 ETH");
        address recipient = emailOwner[recipientEmail];
        require(recipient != address(0), "Recipient email not registered");
        require(bytes(ownerEmail[msg.sender]).length > 0, "Sender must have registered an email");

        // Convert external to internal encrypted handle (gives euint256)
        euint256 encryptedContent = FHE.fromExternal(externalContent, attestation);

        // Compute a deterministic bytes32 handle from the encrypted content
        bytes32 handle = FHE.toBytes32(encryptedContent);

        // Store handles in inbox/outbox (on-chain we only store handle)
        inbox[recipient].push(handle);
        outbox[msg.sender].push(handle);

        // Grant persistent access to the recipient to be able to decrypt/use this handle
        // and also allow the sender (so they can view their sent mail)
        FHE.allow(encryptedContent, recipient);
        FHE.allow(encryptedContent, msg.sender);

        // Also allow this contract to access the handle (useful for future ops)
        FHE.allow(encryptedContent, address(this));

        emit MailSent(msg.sender, recipient, handle);
    }

    /// @notice Return inbox handles for caller
    /// @return an array of bytes32 handles (these are FHE handles pointing to ciphertexts)
    function getInboxHandles() external view returns (bytes32[] memory) {
        return inbox[msg.sender];
    }

    /// @notice Return outbox handles for caller
    function getOutboxHandles() external view returns (bytes32[] memory) {
        return outbox[msg.sender];
    }

    /// @notice Get registered email for caller
    /// @return the email address registered, or empty string if none
    function getMyEmail() external view returns (string memory) {
        return ownerEmail[msg.sender];
    }

    /// @notice Admin withdraw function (owner of contract can withdraw collected fees).
    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "insufficient balance");
        to.transfer(amount);
        emit Withdrawal(to, amount);
    }

    /// @notice Fallback to receive ETH
    receive() external payable {}
}
