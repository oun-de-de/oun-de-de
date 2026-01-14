import { setupWorker } from "msw/browser";
import { mockTokenExpired } from "./handlers/_demo";
import { dailyIncomePos, customerInfo, performance } from "./handlers/_dashboard";
import { menuList } from "./handlers/_menu";
import { signIn, userList } from "./handlers/_user";

const handlers = [signIn, userList, mockTokenExpired, menuList, dailyIncomePos, customerInfo, performance];
const worker = setupWorker(...handlers);

export { worker };
