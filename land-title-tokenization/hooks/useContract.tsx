import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import LandRegistryABI from '../contracts/LandTitleRegistry.json'
import TitleDeedABI from '../contracts/TitleDeedTokenization.json'

export function useContract() {
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [titleDeedContract, setTitleDeedContract] = useState<ethers.Contract | null>(null)

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        
        const landRegistry = new ethers.Contract(
          process.env.NEXT_PUBLIC_LAND_REGISTRY_ADDRESS!,
          LandRegistryABI.abi,
          signer
        )
        
        const titleDeed = new ethers.Contract(
          process.env.NEXT_PUBLIC_TITLE_DEED_ADDRESS!,
          TitleDeedABI.abi,
          signer
        )

        setContract(landRegistry)
        setTitleDeedContract(titleDeed)
      }
    }

    init()
  }, [])

  return { contract, titleDeedContract }
}