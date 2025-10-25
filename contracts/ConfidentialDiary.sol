// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract ConfidentialDiary is SepoliaConfig {
    struct DiaryEntry {
        euint32 encryptedKey;
        string encryptedTitle;
        string encryptedContent;
        uint256 createdAt;
    }

    mapping(address => DiaryEntry[]) private _entries;

    event DiarySubmitted(address indexed owner, uint256 indexed entryId, uint256 timestamp);

    function submitDiary(
        externalEuint32 encryptedKey,
        bytes calldata proof,
        string calldata encryptedTitle,
        string calldata encryptedContent
    ) external returns (uint256) {
        require(bytes(encryptedTitle).length > 0, "Title required");
        require(bytes(encryptedContent).length > 0, "Content required");

        euint32 key = FHE.fromExternal(encryptedKey, proof);

        DiaryEntry memory entry = DiaryEntry({
            encryptedKey: key,
            encryptedTitle: encryptedTitle,
            encryptedContent: encryptedContent,
            createdAt: block.timestamp
        });

        _entries[msg.sender].push(entry);

        DiaryEntry storage storedEntry = _entries[msg.sender][_entries[msg.sender].length - 1];
        FHE.allowThis(storedEntry.encryptedKey);
        FHE.allow(storedEntry.encryptedKey, msg.sender);

        emit DiarySubmitted(msg.sender, _entries[msg.sender].length - 1, storedEntry.createdAt);

        return _entries[msg.sender].length - 1;
    }

    function getDiary(address user, uint256 index) external view returns (DiaryEntry memory) {
        require(index < _entries[user].length, "Invalid diary index");
        return _entries[user][index];
    }

    function listDiaries(address user) external view returns (DiaryEntry[] memory) {
        uint256 length = _entries[user].length;
        DiaryEntry[] memory diaries = new DiaryEntry[](length);

        for (uint256 i = 0; i < length; i++) {
            diaries[i] = _entries[user][i];
        }

        return diaries;
    }

    function getDiaryCount(address user) external view returns (uint256) {
        return _entries[user].length;
    }
}
