import { Result } from "shared/core/Result";
import ErrorGraphql from "shared/errors/ErrorGraphql";

export type responseTunelRepoArray = Result<Tunnel[]> | Result<ErrorGraphql>;
