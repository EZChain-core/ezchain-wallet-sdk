import { ITransactionData } from '@/History/raw_types';
import { iHistoryImportExport } from '@/History/parsed_types';
import { findDestinationChain, findSourceChain, getAssetBalanceFromUTXOs, parseMemo } from '@/History/history_helpers';
import { idToChainAlias } from '@/Network/helpers/aliasFromNetworkID';
import { activeNetwork, xChain } from '@/Network/network';
import { bnToAvaxX } from '@/utils';
import { getOutputsOfChain, getOutputTotals, getOwnedOutputs } from '@/History/utxo_helpers';

export function getImportSummary(tx: ITransactionData, addresses: string[]): iHistoryImportExport {
    let sourceChain = findSourceChain(tx);
    let chainAliasFrom = idToChainAlias(sourceChain);
    let chainAliasTo = idToChainAlias(tx.chainID);

    let outs = tx.outputs || [];
    let myOuts = getOwnedOutputs(outs, addresses);
    let amtOut = getOutputTotals(myOuts);

    let time = new Date(tx.timestamp);
    let fee = xChain.getTxFee();

    let res: iHistoryImportExport = {
        id: tx.id,
        memo: parseMemo(tx.memo),
        source: chainAliasFrom,
        destination: chainAliasTo,
        amount: amtOut,
        amountDisplayValue: bnToAvaxX(amtOut),
        timestamp: time,
        type: 'import',
        fee: fee,
    };

    return res;
}

export function getExportSummary(tx: ITransactionData, addresses: string[]): iHistoryImportExport {
    let sourceChain = findSourceChain(tx);
    let chainAliasFrom = idToChainAlias(sourceChain);

    let destinationChain = findDestinationChain(tx);
    let chainAliasTo = idToChainAlias(destinationChain);

    let outs = tx.outputs || [];
    let myOuts = getOwnedOutputs(outs, addresses);
    let chainOuts = getOutputsOfChain(myOuts, destinationChain);
    let amtOut = getOutputTotals(chainOuts);

    let time = new Date(tx.timestamp);
    let fee = xChain.getTxFee();

    let res: iHistoryImportExport = {
        id: tx.id,
        memo: parseMemo(tx.memo),
        source: chainAliasFrom,
        destination: chainAliasTo,
        amount: amtOut,
        amountDisplayValue: bnToAvaxX(amtOut),
        timestamp: time,
        type: 'export',
        fee: fee,
    };

    return res;
}
