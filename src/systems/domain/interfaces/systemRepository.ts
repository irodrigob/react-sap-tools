import System from "../entities/system";
export default interface SystemRepositoryInterface {
  getUserSystems(user: String): Promise<System[]>;
}
