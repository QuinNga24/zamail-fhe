import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ZamailSimpleModule = buildModule("ZamailSimpleModule", (m) => {
  const zamailSimple = m.contract("ZamailSimple");

  return { zamailSimple };
});

export default ZamailSimpleModule;
