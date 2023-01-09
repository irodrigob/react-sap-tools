import { Result } from "shared/core/Result";
import ErrorGraphql from "shared/errors/ErrorGraphql";

export type responseTunnelRepoArray = Result<Tunnel[]> | Result<ErrorGraphql>;
export type responseTunnelConfigRepo =
  | Result<TunnelConfiguration>
  | Result<ErrorGraphql>;
