// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const LandRegistryModule = buildModule("LandRegistryModule", (m) => {
  // Deploy TitleDeedToken contract
  const titleDeedToken = m.contract("TitleDeedTokenization");

  // Deploy LandRegistry contract with the TitleDeedToken address as a parameter
  const landRegistry = m.contract("LandRegistry", [titleDeedToken.value]);

  // Grant MINTER_ROLE to the LandRegistry contract
  const minterRole = m.call(titleDeedToken, "MINTER_ROLE");
  m.call(titleDeedToken, "grantRole", [minterRole.value, landRegistry]);

  return { titleDeedToken, landRegistry };
});

export default LandRegistryModule;