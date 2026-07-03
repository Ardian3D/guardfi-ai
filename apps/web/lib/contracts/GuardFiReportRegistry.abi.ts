/**
 * ABI for GuardFiReportRegistry (see apps/contracts/contracts/GuardFiReportRegistry.sol).
 * Kept in sync manually — this is a small, stable contract.
 */
export const guardFiReportRegistryAbi = [
  {
    type: "function",
    name: "nextReportId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "submitReport",
    stateMutability: "nonpayable",
    inputs: [
      { name: "target", type: "address" },
      { name: "score", type: "uint8" },
      { name: "reportHash", type: "bytes32" },
      { name: "metadataURI", type: "string" },
    ],
    outputs: [{ name: "reportId", type: "uint256" }],
  },
  {
    type: "function",
    name: "getReport",
    stateMutability: "view",
    inputs: [{ name: "reportId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "reporter", type: "address" },
          { name: "target", type: "address" },
          { name: "score", type: "uint8" },
          { name: "reportHash", type: "bytes32" },
          { name: "metadataURI", type: "string" },
          { name: "timestamp", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getReportsByTarget",
    stateMutability: "view",
    inputs: [{ name: "target", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    type: "function",
    name: "getReportsByReporter",
    stateMutability: "view",
    inputs: [{ name: "reporter", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    type: "event",
    name: "ReportSubmitted",
    inputs: [
      { name: "reportId", type: "uint256", indexed: true },
      { name: "reporter", type: "address", indexed: true },
      { name: "target", type: "address", indexed: true },
      { name: "score", type: "uint8", indexed: false },
      { name: "reportHash", type: "bytes32", indexed: false },
      { name: "metadataURI", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  { type: "error", name: "InvalidTarget", inputs: [] },
  { type: "error", name: "InvalidScore", inputs: [] },
  { type: "error", name: "InvalidReportHash", inputs: [] },
  { type: "error", name: "ReportNotFound", inputs: [] },
] as const;
