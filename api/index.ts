import * as solanaWeb3 from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

import { accountFromSeed } from "../utils";

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

const getHistory = async (publicKey: string) => {
  const history = await fetch(String("https://hyper.solana.fm/v3/account-transfers/" + publicKey))

  return history.json();
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

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

async function findAssociatedTokenAddress(
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

const getTokenBalance = async (publicKey: string, splToken: string) => {
  const connection = createConnection();

  const account = await findAssociatedTokenAddress(
    publicKeyFromString(publicKey),
    publicKeyFromString(splToken)
  );

  try {
    const balance = await connection.getTokenAccountBalance(
      publicKeyFromString(account.toString())
    );
    return balance.value.amount / LAMPORTS_PER_SOL;
  } catch (e) {
    return 0;
  }
};

import * as anchor from "@project-serum/anchor";

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
  getTokenBalance,
};
