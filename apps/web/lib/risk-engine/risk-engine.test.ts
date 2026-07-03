import { describe, it, expect } from "vitest";
import { toFunctionSelector } from "viem";
import { computeScore, mapRiskLevel } from "./scoring";
import { buildRiskIndicators } from "./rules";
import {
  detectSelectorsFromBytecode,
  validateScanRequest,
  ScanError,
} from "./scanner";
import type { ContractMetadata, RiskIndicator } from "./types";

function baseMetadata(overrides: Partial<ContractMetadata> = {}): ContractMetadata {
  return {
    targetAddress: "0x1111111111111111111111111111111111111111",
    chainId: 177,
    isContract: true,
    bytecodeSize: 1000,
    tokenName: "Sample Token",
    tokenSymbol: "SMPL",
    decimals: 18,
    totalSupply: "1000",
    sourceVerified: false,
    proxyDetected: false,
    detectedSelectors: [],
    scanTime: new Date().toISOString(),
    ...overrides,
  };
}

function ind(severity: RiskIndicator["severity"]): RiskIndicator {
  return {
    code: "X",
    severity,
    title: "t",
    description: "d",
    evidence: "e",
    confidence: "LOW",
  };
}

describe("scoring.computeScore", () => {
  it("sums severity weights", () => {
    expect(computeScore([ind("CRITICAL")])).toBe(25);
    expect(computeScore([ind("HIGH")])).toBe(15);
    expect(computeScore([ind("MEDIUM")])).toBe(8);
    expect(computeScore([ind("LOW")])).toBe(3);
    expect(computeScore([ind("HIGH"), ind("MEDIUM"), ind("LOW")])).toBe(26);
  });

  it("caps at 100", () => {
    expect(computeScore(Array(10).fill(ind("CRITICAL")))).toBe(100);
  });

  it("is 0 for no indicators", () => {
    expect(computeScore([])).toBe(0);
  });
});

describe("scoring.mapRiskLevel", () => {
  it("maps score ranges to levels", () => {
    expect(mapRiskLevel(0)).toBe("LOW");
    expect(mapRiskLevel(20)).toBe("LOW");
    expect(mapRiskLevel(21)).toBe("MODERATE");
    expect(mapRiskLevel(50)).toBe("MODERATE");
    expect(mapRiskLevel(51)).toBe("HIGH");
    expect(mapRiskLevel(75)).toBe("HIGH");
    expect(mapRiskLevel(76)).toBe("CRITICAL");
    expect(mapRiskLevel(100)).toBe("CRITICAL");
  });
});

describe("rules.buildRiskIndicators", () => {
  it("returns only NON_CONTRACT_ADDRESS when not a contract", () => {
    const indicators = buildRiskIndicators(
      baseMetadata({ isContract: false, bytecodeSize: 0 }),
      "TOKEN"
    );
    expect(indicators).toHaveLength(1);
    expect(indicators[0].code).toBe("NON_CONTRACT_ADDRESS");
    expect(indicators[0].severity).toBe("CRITICAL");
  });

  it("generates indicators from detected selectors", () => {
    const indicators = buildRiskIndicators(
      baseMetadata({
        detectedSelectors: [
          "owner()",
          "mint(address,uint256)",
          "blacklist(address)",
          "pause()",
          "setFee(uint256)",
        ],
      }),
      "TOKEN"
    );
    const codes = indicators.map((i) => i.code);
    expect(codes).toContain("OWNER_PRIVILEGE_DETECTED");
    expect(codes).toContain("MINT_FUNCTION_DETECTED");
    expect(codes).toContain("BLACKLIST_FUNCTION_DETECTED");
    expect(codes).toContain("PAUSE_FUNCTION_DETECTED");
    expect(codes).toContain("TRANSFER_TAX_SELECTOR_DETECTED");
    expect(codes).toContain("BYTECODE_AVAILABLE");
  });

  it("marks proxy as HIGH when EIP-1967 slot is set", () => {
    const indicators = buildRiskIndicators(
      baseMetadata({ proxyDetected: true }),
      "CONTRACT"
    );
    const proxy = indicators.find((i) => i.code === "PROXY_PATTERN_DETECTED");
    expect(proxy?.severity).toBe("HIGH");
  });

  it("flags TOKEN_METADATA_UNAVAILABLE when token fields are missing", () => {
    const indicators = buildRiskIndicators(
      baseMetadata({ tokenName: undefined, tokenSymbol: undefined }),
      "TOKEN"
    );
    const meta = indicators.find((i) => i.code === "TOKEN_METADATA_UNAVAILABLE");
    expect(meta?.severity).toBe("MEDIUM"); // MEDIUM for TOKEN scans
  });
});

describe("scanner.detectSelectorsFromBytecode", () => {
  it("detects a selector present in bytecode", () => {
    const ownerSelector = toFunctionSelector("owner()").slice(2); // 8da5cb5b
    const bytecode = `0x6080604052${ownerSelector}deadbeef`;
    const found = detectSelectorsFromBytecode(bytecode);
    expect(found).toContain("owner()");
  });

  it("returns empty for empty bytecode", () => {
    expect(detectSelectorsFromBytecode("0x")).toEqual([]);
    expect(detectSelectorsFromBytecode("")).toEqual([]);
  });

  it("does not detect selectors that are absent", () => {
    const found = detectSelectorsFromBytecode("0xabcdef0123456789");
    expect(found).not.toContain("mint(address,uint256)");
  });
});

describe("scanner.validateScanRequest", () => {
  it("throws INVALID_ADDRESS for a bad address", () => {
    try {
      validateScanRequest({ targetAddress: "0x123", chainId: 177, scanType: "TOKEN" });
      throw new Error("should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(ScanError);
      expect((e as ScanError).code).toBe("INVALID_ADDRESS");
    }
  });

  it("throws WRONG_CHAIN for an unsupported chain", () => {
    try {
      validateScanRequest({
        targetAddress: "0x1111111111111111111111111111111111111111",
        chainId: 1,
        scanType: "TOKEN",
      });
      throw new Error("should have thrown");
    } catch (e) {
      expect((e as ScanError).code).toBe("WRONG_CHAIN");
    }
  });

  it("returns a checksummed request for valid input", () => {
    const req = validateScanRequest({
      targetAddress: "0x1111111111111111111111111111111111111111",
      chainId: 177,
      scanType: "CONTRACT",
    });
    expect(req.chainId).toBe(177);
    expect(req.scanType).toBe("CONTRACT");
    expect(req.targetAddress.startsWith("0x")).toBe(true);
  });
});
