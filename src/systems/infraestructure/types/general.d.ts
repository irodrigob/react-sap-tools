import { Result } from "shared/core/Result";
import ErrorGraphql from "shared/errors/ErrorGraphql";

export type responseSystemRepoArray = Result<System[]> | Result<ErrorGraphql>;
export type responseSystemRepo = Result<System> | Result<ErrorGraphql>;
export type responseNewSystemRepo = Result<System> | Result<ErrorGraphql>;
