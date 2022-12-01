import System from "../entities/system";
export default interface SystemRepositoy{
    getList():Promise<System[]>
}