import { expect } from "chai";
import { ethers } from "hardhat";
import { Zamail } from "../types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Zamail", function () {
  let zamail: Zamail;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;

  const REGISTER_FEE = ethers.parseEther("0.001");
  const SEND_MAIL_FEE = ethers.parseEther("0.0001");

  beforeEach(async function () {
    const ZamailFactory = await ethers.getContractFactory("Zamail");
    zamail = await ZamailFactory.deploy();
    await zamail.waitForDeployment();

    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("Email Registration", function () {
    it("Should allow user to register an email", async function () {
      const email = "alice@zamail.com";
      
      await zamail.connect(addr1).registerEmail(email, { value: REGISTER_FEE });
      
      expect(await zamail.emailOwner(email)).to.equal(addr1.address);
      expect(await zamail.ownerEmail(addr1.address)).to.equal(email);
    });

    it("Should not allow registration without exact fee", async function () {
      const email = "bob@zamail.com";
      const wrongFee = ethers.parseEther("0.0005");
      
      await expect(
        zamail.connect(addr1).registerEmail(email, { value: wrongFee })
      ).to.be.revertedWith("Must send exact 0.001 ETH");
    });

    it("Should not allow duplicate email registration", async function () {
      const email = "charlie@zamail.com";
      
      await zamail.connect(addr1).registerEmail(email, { value: REGISTER_FEE });
      
      await expect(
        zamail.connect(addr2).registerEmail(email, { value: REGISTER_FEE })
      ).to.be.revertedWith("Email already taken");
    });

    it("Should not allow one wallet to register multiple emails", async function () {
      const email1 = "user@zamail.com";
      const email2 = "user2@zamail.com";
      
      await zamail.connect(addr1).registerEmail(email1, { value: REGISTER_FEE });
      
      await expect(
        zamail.connect(addr1).registerEmail(email2, { value: REGISTER_FEE })
      ).to.be.revertedWith("Sender already has an email");
    });
  });

  describe("Email Retrieval", function () {
    it("Should retrieve registered email for user", async function () {
      const email = "user@zamail.com";
      
      await zamail.connect(addr1).registerEmail(email, { value: REGISTER_FEE });
      
      expect(await zamail.connect(addr1).getMyEmail()).to.equal(email);
    });

    it("Should return empty string for unregistered user", async function () {
      expect(await zamail.connect(addr2).getMyEmail()).to.equal("");
    });
  });

  describe("Inbox/Outbox Retrieval", function () {
    it("Should return empty arrays for new user", async function () {
      const inboxHandles = await zamail.connect(addr1).getInboxHandles();
      const outboxHandles = await zamail.connect(addr1).getOutboxHandles();
      
      expect(inboxHandles.length).to.equal(0);
      expect(outboxHandles.length).to.equal(0);
    });
  });

  describe("Withdrawal", function () {
    it("Should allow owner to withdraw funds", async function () {
      const email = "alice@zamail.com";
      
      await zamail.connect(addr1).registerEmail(email, { value: REGISTER_FEE });
      
      const contractBalance = await ethers.provider.getBalance(await zamail.getAddress());
      expect(contractBalance).to.be.gt(0);
      
      const initialBalance = await ethers.provider.getBalance(owner.address);
      
      const tx = await zamail.withdraw(owner.address, contractBalance);
      const receipt = await tx.wait();
      const gasUsed = receipt?.gasUsed || 0n;
      const gasPrice = receipt?.gasPrice || 0n;
      const gasCost = gasUsed * gasPrice;
      
      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.approximately(
        initialBalance + contractBalance - gasCost,
        ethers.parseEther("0.0001")
      );
    });

    it("Should not allow non-owner to withdraw", async function () {
      const email = "bob@zamail.com";
      
      await zamail.connect(addr1).registerEmail(email, { value: REGISTER_FEE });
      
      const contractBalance = await ethers.provider.getBalance(await zamail.getAddress());
      
      await expect(
        zamail.connect(addr1).withdraw(addr1.address, contractBalance)
      ).to.be.revertedWith("only owner");
    });
  });

  describe("Receive ETH", function () {
    it("Should accept ETH sent directly", async function () {
      const amount = ethers.parseEther("0.1");
      
      await owner.sendTransaction({
        to: await zamail.getAddress(),
        value: amount,
      });
      
      const balance = await ethers.provider.getBalance(await zamail.getAddress());
      expect(balance).to.equal(amount);
    });
  });
});
