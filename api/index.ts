import * as solanaWeb3 from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  decodeTransferCheckedInstruction,
  decodeTransferInstruction,
  decodeTransferInstructionUnchecked,
  TOKEN_PROGRAM_ID,
  transfer,
  transferChecked,
} from "@solana/spl-token";
import { Account } from "@metaplex-foundation/mpl-core";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { Token } from "@solana/spl-token";

export const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
const getPDA = async (mint: PublicKey): Promise<PublicKey> => {
  return (
    await PublicKey.findProgramAddress(
      [Buffer.from("metadata"), mint.toBuffer()],
      METADATA_PROGRAM_ID
    )
  )[0];
};

export const TOKENS = [
  "32QvRf1cK1xutcGVFm2K84BZQNf1g2sWG1YBVRMuuTRX",
  "2m21xp8rTJ2yALTnfYS4PMGhYRFq1NoP6T5YWvzRfkYS",
  "HzbbmGHr1wzmjnJ3USHNHg4SeefTmiNAak7UdvEAzkg8",
  "DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ",
];

const LAMPORTS_PER_SOL = solanaWeb3.LAMPORTS_PER_SOL;

const SPL_TOKEN = "FyUYPbYiEFjC5LG4oYqdBfiA6PwgC78kbVyWAoYkwMTC";

const createConnection = () => {
  return new solanaWeb3.Connection("https://ssc-dao.genesysgo.net");
};

const getBalance = async (publicKey) => {
  const connection = createConnection();
  const _publicKey = publicKeyFromString(publicKey);

  const lamports = await connection.getBalance(_publicKey).catch((err) => {
    console.error(`Error: ${err}`);
  });

  const sol = lamports / LAMPORTS_PER_SOL;
  return sol;
};

const getSolanaPrice = async () => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd`,
    {
      method: "GET",
    }
  );

  const data = await response.json();
  return data.solana.usd;
};

const requestAirDrop = async (publicKeyString: string) => {
  const connection = createConnection();

  const airdropSignature = await connection.requestAirdrop(
    publicKeyFromString(publicKeyString),
    LAMPORTS_PER_SOL
  );

  const signature = await connection.confirmTransaction(airdropSignature);
  return signature;
};

const publicKeyFromString = (publicKeyString: string) => {
  return new solanaWeb3.PublicKey(publicKeyString);
};

const transaction = async (from: solanaWeb3.Keypair, to, amount) => {
  console.log("Executing transaction...");
  console.log(amount);

  const transaction = new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: publicKeyFromString(to),
      lamports: amount,
    })
  );

  // Sign transaction, broadcast, and confirm
  const connection = createConnection();
  const signature = await solanaWeb3.sendAndConfirmTransaction(
    connection,
    transaction,
    [from]
  );
  console.log("SIGNATURE", signature);
};
export const tokenTransfer = async (
  from: solanaWeb3.Keypair,
  to: PublicKey,
  mint: PublicKey,
  amount: number
) => {
  const connection = createConnection();
  console.log(from, to, mint);

  var transaction = new solanaWeb3.Transaction();

  const fromAta = await findAssociatedTokenAddress(from.publicKey, mint);
  const toAta = await findAssociatedTokenAddress(to, mint);
  const toAtaInfo = await connection.getAccountInfo(toAta);
  if (toAtaInfo === null) {
    transaction.add(
      createAssociatedTokenAccountInstruction(from.publicKey, toAta, to, mint)
    );
  }

  console.log(".....");
  transaction.add(
    createTransferInstruction(fromAta, toAta, from.publicKey, amount)
  );

  console.log(",,,,,", transaction);
  const signature = await solanaWeb3.sendAndConfirmTransaction(
    connection,
    transaction,
    [from]
  );
  console.log("SIGNATURE", signature);
};

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey> {
  return (
    await solanaWeb3.PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0];
}

export interface TokenBalance {
  mint: string;
  ata: string;
  name: string;
  symbol: string;
  amount: string;
  uiAmount: number;
  decimals: number;
}
export interface TokensBalance {
  [key: string]: TokenBalance;
}

const getTokensBalance = async (publicKey: string): Promise<TokensBalance> => {
  const newTokens = TOKENS.slice(0, TOKENS.length - 1);
  const connection = createConnection();

  const tokensBalance: TokensBalance = {};

  const metadataPdas = await Promise.all(
    newTokens.map(async (token) => await Metadata.getPDA(new PublicKey(token)))
  );

  const metadataPdasInfos = await connection.getMultipleAccountsInfo(
    metadataPdas
  );

  for (var i = 0; i < TOKENS.length; i++) {
    const token = TOKENS[i];

    if (i < TOKENS.length - 1) {
      const {
        data: { data: metadata },
      } = Metadata.from(new Account(metadataPdas[i], metadataPdasInfos[i]!));

      const account = await findAssociatedTokenAddress(
        publicKeyFromString(publicKey),
        publicKeyFromString(token)
      );

      try {
        const balance = await connection.getTokenAccountBalance(
          publicKeyFromString(account.toString())
        );

        tokensBalance[token] = {
          mint: token,
          ata: account.toString(),
          name: metadata.name,
          symbol: metadata.symbol,
          amount: balance.value.amount,
          uiAmount: balance.value.uiAmount!,
          decimals: balance.value.decimals,
        };
      } catch (_) {}
    } else {
      const metadata = {
        name: "DUST Protocol",
        symbol: "DUST",
      }
      const account = await findAssociatedTokenAddress(
        publicKeyFromString(publicKey),
        publicKeyFromString(token)
      );

      try {
        const balance = await connection.getTokenAccountBalance(
          publicKeyFromString(account.toString())
        );

        tokensBalance[token] = {
          mint: token,
          ata: account.toString(),
          name: metadata.name,
          symbol: metadata.symbol,
          amount: balance.value.amount,
          uiAmount: balance.value.uiAmount!,
          decimals: balance.value.decimals,
        };
      } catch (_) {}
    }
  }

  const solBalance = await connection.getBalance(new PublicKey(publicKey));
  tokensBalance[publicKey] = {
    mint: publicKey.toString(),
    ata: publicKey.toString(),
    name: "Solana",
    symbol: "SOL",
    amount: solBalance.toString(),
    uiAmount: solBalance / LAMPORTS_PER_SOL,
    decimals: 9,
  }

  return tokensBalance;
};

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const awaitTransactionSignatureConfirmation = async (
  txid: string,
  connection: solanaWeb3.Connection,
  queryStatus = false
): Promise<solanaWeb3.SignatureStatus | null | void> => {
  let confirmations = 0;
  let done = false;
  let status: solanaWeb3.SignatureStatus | null | void = {
    slot: 0,
    confirmations: 0,
    err: null,
  };
  status = await new Promise(async (resolve, reject) => {
    while (!done && queryStatus && confirmations < 40) {
      // eslint-disable-next-line no-loop-func
      (async () => {
        try {
          const signatureStatuses = await connection.getSignatureStatuses([
            txid,
          ]);
          status = signatureStatuses && signatureStatuses.value[0];
          if (!done) {
            if (!status) {
            } else if (status.err) {
              done = true;
              reject(status.err);
            } else if (!status.confirmations) {
              if (status.confirmationStatus === "finalized") {
                done = true;
                resolve(status);
              }
            }
          }
        } catch (e) {
          if (!done) {
            console.log("REST connection error: txid", txid, e);
          }
        }
      })();
      await sleep(2000);
    }
  });

  done = true;
  console.log("Returning status", status);
  return status;
};

const getHistory = async (
  currency: "native" | "token",
  publicKey: string[]
) => {
  if (currency === "native") {
    var history = await (
      await fetch(
        `https://public-api.solscan.io/account/solTransfers?account=${publicKey[0]}&offset=0&limit=10`
      )
    ).json();

    history = history.data.reduce((acc, tx) => {
      return {
        ...acc,
        [tx.txHash]: {
          status: tx.status,
          timestamp: tx.blockTime,
          source: tx.src,
          destination: tx.dst,
          amount: tx.lamport,
        },
      };
    }, {});

    return history;
  }

  if (currency === "token") {
    const connection = createConnection();
    const ata = await findAssociatedTokenAddress(
      new PublicKey(publicKey[1]),
      new PublicKey(publicKey[0])
    );
    const transactionsSignaturesInfo = await connection.getSignaturesForAddress(
      ata
    );
    const transactionsInfo = await connection.getTransactions(
      transactionsSignaturesInfo.map((tx) => tx.signature)
    );

    const history = transactionsInfo.reduce((acc, tx) => {
      const message = solanaWeb3.Message.from(
        tx?.transaction.message.serialize()!
      );
      const transaction = solanaWeb3.Transaction.populate(message);
      const transferRecord = transaction.instructions.reduce((acc, ix) => {
        try {
          const transferIx = decodeTransferInstruction(ix);
          const data = {
            status: "success",
            timestamp: tx?.blockTime,
            source: transferIx.keys.source.pubkey.toString(),
            destination: transferIx.keys.destination.pubkey.toString(),
            amount: Number(transferIx.data.amount),
          };
          const accData = { ...acc, [tx?.transaction.signatures[0]!]: data };
          return accData;
        } catch (e) {}
        try {
          const transferIx = decodeTransferCheckedInstruction(ix);
          const data = {
            status: "success",
            timestamp: tx?.blockTime,
            source: transferIx.keys.source.pubkey.toString(),
            destination: transferIx.keys.destination.pubkey.toString(),
            amount: Number(transferIx.data.amount),
          };
          const accData = { ...acc, [tx?.transaction.signatures[0]!]: data };
          return accData;
        } catch (e) {}
        return { ...acc };
      }, {});

      return {
        ...acc,
        ...transferRecord,
      };
    }, {});

    return history;
  }

  return {};
};

export {
  LAMPORTS_PER_SOL,
  SPL_TOKEN,
  createConnection,
  getBalance,
  getHistory,
  getSolanaPrice,
  publicKeyFromString,
  requestAirDrop,
  transaction,
  getTokensBalance,
};
