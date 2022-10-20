/* Updated imports */
import { createQR, encodeURL, TransferRequestURLFields, findReference, validateTransfer, FindReferenceError, ValidateTransferError } from "@solana/pay";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef } from "react";
import BackLink from "../../components/BackLink";
import PageHeading from "../../components/PageHeading";
import { shopAddress, usdcAddress } from "../../lib/addresses";
import calculatePrice from "../../lib/calculatePrice";

/* Add code to the component to get the Solana connection */
// Unique address that we can listen for payments to
const reference = useMemo(() => Keypair.generate().publicKey, [])

// Get a connection to Solana devnet
const network = WalletAdapterNetwork.Devnet
const endpoint = clusterApiUrl(network)
const connection = new Connection(endpoint)

// Solana Pay transfer params
const urlParams: TransferRequestURLFields = {
  recipient: shopAddress,
  splToken: usdcAddress,
  amount,
  reference,
  label: "Cookies Inc",
  message: "Thanks for your order! 🍪",
}

/* Add a new useEffect to detect payment */
// Check every 0.5s if the transaction is completed
useEffect(() => {
  const interval = setInterval(async () => {
    try {
      // Check if there is any transaction for the reference
      const signatureInfo = await findReference(connection, reference, { finality: 'confirmed' })
      // Validate that the transaction has the expected recipient, amount and SPL token
      await validateTransfer(
        connection,
        signatureInfo.signature,
        {
          recipient: shopAddress,
          amount,
          splToken: usdcAddress,
          reference,
        },
        { commitment: 'confirmed' }
      )
      router.push('/shop/confirmed')
    } catch (e) {
      if (e instanceof FindReferenceError) {
        // No transaction found yet, ignore this error
        return;
      }
      if (e instanceof ValidateTransferError) {
        // Transaction is invalid
        console.error('Transaction is invalid', e)
        return;
      }
      console.error('Unknown error', e)
    }
  }, 500)
  return () => {
    clearInterval(interval)
  }
}, [amount])