import System from "systems/domain/entities/system";
import { Result } from "shared/core/Result";

export type responseSystemRepoArray = Result<System[]>;

export default interface SystemRepositoryInterface {
  getUserSystems(user: String): Promise<responseSystemRepoArray>;
}
