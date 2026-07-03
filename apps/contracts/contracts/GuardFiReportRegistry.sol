// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title GuardFiReportRegistry
 * @notice On-chain registry of GuardFi AI risk-report *commitments*.
 *
 * Only a minimal, tamper-evident commitment lives on-chain:
 * reporter, target, score, report hash, metadata URI, and timestamp.
 * The full AI report is kept off-chain (e.g. IPFS) and referenced via
 * `reportHash` + `metadataURI`.
 *
 * This is NOT a token contract. GuardFi AI has no token.
 * The user's own wallet signs `submitReport()`; there is no privileged owner
 * and no backend relayer in this MVP.
 */
contract GuardFiReportRegistry {
    /// @notice A single report commitment.
    struct Report {
        uint256 id;
        address reporter;
        address target;
        uint8 score;
        bytes32 reportHash;
        string metadataURI;
        uint256 timestamp;
    }

    /// @notice Id assigned to the next submitted report (starts at 1).
    uint256 public nextReportId = 1;

    /// @dev reportId => Report.
    mapping(uint256 => Report) private reports;
    /// @dev target address => list of report ids.
    mapping(address => uint256[]) private reportsByTarget;
    /// @dev reporter address => list of report ids.
    mapping(address => uint256[]) private reportsByReporter;

    /// @notice Emitted whenever a report commitment is stored.
    event ReportSubmitted(
        uint256 indexed reportId,
        address indexed reporter,
        address indexed target,
        uint8 score,
        bytes32 reportHash,
        string metadataURI,
        uint256 timestamp
    );

    /// @notice Target contract address must not be the zero address.
    error InvalidTarget();
    /// @notice Score must be within 0..100 (inclusive).
    error InvalidScore();
    /// @notice Report hash must not be the zero hash.
    error InvalidReportHash();
    /// @notice No report exists for the requested id.
    error ReportNotFound();

    /**
     * @notice Store a new report commitment. Callable by any wallet; the
     *         caller (`msg.sender`) is recorded as the reporter.
     * @param target       Address of the analyzed contract/token.
     * @param score        Risk score, 0..100.
     * @param reportHash   Hash (e.g. keccak256/IPFS CID digest) of the full report.
     * @param metadataURI  URI pointing to public verification metadata.
     * @return reportId     The id assigned to the stored report.
     */
    function submitReport(
        address target,
        uint8 score,
        bytes32 reportHash,
        string calldata metadataURI
    ) external returns (uint256 reportId) {
        if (target == address(0)) revert InvalidTarget();
        if (score > 100) revert InvalidScore();
        if (reportHash == bytes32(0)) revert InvalidReportHash();

        reportId = nextReportId;
        unchecked {
            nextReportId = reportId + 1;
        }

        reports[reportId] = Report({
            id: reportId,
            reporter: msg.sender,
            target: target,
            score: score,
            reportHash: reportHash,
            metadataURI: metadataURI,
            timestamp: block.timestamp
        });

        reportsByTarget[target].push(reportId);
        reportsByReporter[msg.sender].push(reportId);

        emit ReportSubmitted(
            reportId,
            msg.sender,
            target,
            score,
            reportHash,
            metadataURI,
            block.timestamp
        );
    }

    /**
     * @notice Fetch a report by id.
     * @dev Reverts with {ReportNotFound} if the id was never assigned.
     */
    function getReport(uint256 reportId) external view returns (Report memory) {
        Report memory report = reports[reportId];
        if (report.id == 0) revert ReportNotFound();
        return report;
    }

    /// @notice All report ids recorded against a target address.
    function getReportsByTarget(address target) external view returns (uint256[] memory) {
        return reportsByTarget[target];
    }

    /// @notice All report ids submitted by a reporter address.
    function getReportsByReporter(address reporter) external view returns (uint256[] memory) {
        return reportsByReporter[reporter];
    }
}
