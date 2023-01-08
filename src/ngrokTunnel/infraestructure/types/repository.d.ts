import { Result } from "shared/core/Result";
import ErrorGraphql from "shared/errors/ErrorGraphql";
import TunnelRepository from "../repositories/tunnelRepository";

export type responseTunnelRepoArray = Result<Tunnel[]> | Result<ErrorGraphql>;
export type responseTunnelConfigRepo =
  | Result<TunnelRepository[]>
  | Result<ErrorGraphql>;
