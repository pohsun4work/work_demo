import { createRouter, createWebHistory } from "vue-router";

const views = {
  ...import.meta.glob("../views/**.vue"),
  ...import.meta.glob("../views/**/**.vue"),
};

//#region ----- functions -----
const pipe =
  (...fns: Function[]) =>
  (value: any) =>
    fns.reduce((acc, fn) => fn(acc), value);

const toArray = (obj: { [path: string]: Function }): [string, Function][] =>
  Object.entries(obj);

const toRoutesObj = (viewsArr: [string, Function][]): IRouterItem[] =>
  viewsArr.map(([relativePath, component]) => {
    const path = relativePath
      // eslint-disable-next-line no-useless-escape
      .replace(/^..\/views\/([\w\/[\]-]*?)(?:\/index)?\.vue$/, "$1")
      .replace(/\/?\[(.*?)\]/g, "/:$1");

    const name = path.replace(/\s?\/?_/, " _");

    return {
      path: path,
      name: name,
      component: component,
    };
  });

const sortByPath = (routeArr: IRouterItem[]): IRouterItem[] =>
  routeArr.sort(({ path: pa }, { path: pb }) => pa.localeCompare(pb));

const processChildren = (routeArr: IRouterItem[]): IRouterItem[] =>
  routeArr.reduce((accu: IRouterItem[], { path, ...rest }) => {
    let checkI: number = path.indexOf("_");
    if (path.charAt(checkI - 1) === "/") checkI -= 1;

    //不是children直接回傳
    if (checkI === -1) return [...accu, { path, ...rest }];

    return accu.map((v) => {
      if (v.path !== path.substring(0, checkI)) return v;

      const children = [
        ...(v.children ?? []),
        { path: `${path.substring(checkI + 1).replace(/^_/, "")}`, ...rest },
      ];

      return { ...v, children: processChildren(children) };
    });
  }, []);

const formatPath = (routeArr: IRouterItem[]): IRouterItem[] =>
  routeArr.map(({ path, ...rest }) => {
    let _path: string = path.charAt(0).toLocaleLowerCase() + path.substring(1);

    switch (_path) {
      case "homePage":
        _path = "";
        break;
      case "notFound":
        _path = ":pathMatch(.*)*";
        break;
      default:
        break;
    }

    return { path: `/${_path}`, ...rest };
  });
//#endregion

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: pipe(
    toArray,
    toRoutesObj,
    sortByPath,
    processChildren,
    formatPath
  )(views),
});

export default router;

interface IRouterItem {
  path: string;
  name: string;
  component: Function;
  children?: IRouterItem[];
}
