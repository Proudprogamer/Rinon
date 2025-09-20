import { type NextFunction, type Request } from "express";
declare function tokenChecker(req: Request, token: string, next: NextFunction): Promise<void>;
export default tokenChecker;
//# sourceMappingURL=index.d.ts.map