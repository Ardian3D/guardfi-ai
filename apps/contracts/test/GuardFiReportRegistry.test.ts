import { expect } from "chai";
import { ethers } from "hardhat";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const SAMPLE_HASH =
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
const ZERO_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const METADATA_URI = "ipfs://QmSampleMetadataCID";

describe("GuardFiReportRegistry", () => {
  let registry: any;
  let reporter: HardhatEthersSigner;
  let otherReporter: HardhatEthersSigner;
  let target: HardhatEthersSigner;
  let otherTarget: HardhatEthersSigner;

  beforeEach(async () => {
    [reporter, otherReporter, target, otherTarget] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("GuardFiReportRegistry");
    registry = await factory.deploy();
    await registry.waitForDeployment();
  });

  it("starts nextReportId at 1", async () => {
    expect(await registry.nextReportId()).to.equal(1n);
  });

  it("submits a report successfully and stores all fields", async () => {
    await registry
      .connect(reporter)
      .submitReport(target.address, 72, SAMPLE_HASH, METADATA_URI);

    const report = await registry.getReport(1);
    expect(report.id).to.equal(1n);
    expect(report.reporter).to.equal(reporter.address);
    expect(report.target).to.equal(target.address);
    expect(report.score).to.equal(72);
    expect(report.reportHash).to.equal(SAMPLE_HASH);
    expect(report.metadataURI).to.equal(METADATA_URI);
    expect(report.timestamp).to.be.greaterThan(0n);
  });

  it("increments reportId on each submission", async () => {
    await registry.submitReport(target.address, 10, SAMPLE_HASH, METADATA_URI);
    expect(await registry.nextReportId()).to.equal(2n);

    await registry.submitReport(target.address, 20, SAMPLE_HASH, METADATA_URI);
    expect(await registry.nextReportId()).to.equal(3n);

    expect((await registry.getReport(1)).id).to.equal(1n);
    expect((await registry.getReport(2)).id).to.equal(2n);
  });

  it("emits ReportSubmitted with the correct args", async () => {
    const tx = await registry
      .connect(reporter)
      .submitReport(target.address, 50, SAMPLE_HASH, METADATA_URI);
    const receipt = await tx.wait();
    const block = await ethers.provider.getBlock(receipt!.blockNumber);

    await expect(tx)
      .to.emit(registry, "ReportSubmitted")
      .withArgs(
        1n,
        reporter.address,
        target.address,
        50,
        SAMPLE_HASH,
        METADATA_URI,
        BigInt(block!.timestamp)
      );
  });

  it("reverts with InvalidTarget for the zero address", async () => {
    await expect(
      registry.submitReport(ethers.ZeroAddress, 50, SAMPLE_HASH, METADATA_URI)
    ).to.be.revertedWithCustomError(registry, "InvalidTarget");
  });

  it("reverts with InvalidScore when score > 100", async () => {
    await expect(
      registry.submitReport(target.address, 101, SAMPLE_HASH, METADATA_URI)
    ).to.be.revertedWithCustomError(registry, "InvalidScore");
  });

  it("allows boundary scores 0 and 100", async () => {
    await expect(
      registry.submitReport(target.address, 0, SAMPLE_HASH, METADATA_URI)
    ).to.not.be.reverted;
    await expect(
      registry.submitReport(target.address, 100, SAMPLE_HASH, METADATA_URI)
    ).to.not.be.reverted;
  });

  it("reverts with InvalidReportHash for the zero hash", async () => {
    await expect(
      registry.submitReport(target.address, 50, ZERO_HASH, METADATA_URI)
    ).to.be.revertedWithCustomError(registry, "InvalidReportHash");
  });

  it("getReport returns the stored report", async () => {
    await registry
      .connect(reporter)
      .submitReport(target.address, 33, SAMPLE_HASH, METADATA_URI);
    const report = await registry.getReport(1);
    expect(report.score).to.equal(33);
    expect(report.reporter).to.equal(reporter.address);
  });

  it("getReport reverts with ReportNotFound for an unknown id", async () => {
    await expect(registry.getReport(999)).to.be.revertedWithCustomError(
      registry,
      "ReportNotFound"
    );
  });

  it("getReportsByTarget returns ids for that target", async () => {
    await registry.submitReport(target.address, 10, SAMPLE_HASH, METADATA_URI);
    await registry.submitReport(target.address, 20, SAMPLE_HASH, METADATA_URI);

    const ids = await registry.getReportsByTarget(target.address);
    expect(ids.map((i) => i.toString())).to.deep.equal(["1", "2"]);
    expect(await registry.getReportsByTarget(otherTarget.address)).to.deep.equal(
      []
    );
  });

  it("getReportsByReporter returns ids for that reporter", async () => {
    await registry
      .connect(reporter)
      .submitReport(target.address, 10, SAMPLE_HASH, METADATA_URI);
    await registry
      .connect(otherReporter)
      .submitReport(target.address, 20, SAMPLE_HASH, METADATA_URI);

    const reporterIds = await registry.getReportsByReporter(reporter.address);
    const otherIds = await registry.getReportsByReporter(otherReporter.address);
    expect(reporterIds.map((i) => i.toString())).to.deep.equal(["1"]);
    expect(otherIds.map((i) => i.toString())).to.deep.equal(["2"]);
  });

  it("records multiple reports for the same target", async () => {
    await registry.submitReport(target.address, 10, SAMPLE_HASH, METADATA_URI);
    await registry.submitReport(target.address, 20, SAMPLE_HASH, METADATA_URI);
    await registry.submitReport(target.address, 30, SAMPLE_HASH, METADATA_URI);

    const ids = await registry.getReportsByTarget(target.address);
    expect(ids.length).to.equal(3);
  });

  it("records multiple reports for the same reporter", async () => {
    await registry
      .connect(reporter)
      .submitReport(target.address, 10, SAMPLE_HASH, METADATA_URI);
    await registry
      .connect(reporter)
      .submitReport(otherTarget.address, 20, SAMPLE_HASH, METADATA_URI);

    const ids = await registry.getReportsByReporter(reporter.address);
    expect(ids.length).to.equal(2);
  });
});
