import { setupWorker } from "msw/browser";
import { mockTokenExpired } from "./handlers/_demo";
import { menuList } from "./handlers/_menu";
import { signIn, userList } from "./handlers/_user";
import { customerList } from "./handlers/_customer";

const handlers = [signIn, userList, mockTokenExpired, menuList, customerList];
const worker = setupWorker(...handlers);

export { worker };
