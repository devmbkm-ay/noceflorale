(() => {
  var e = {};
  (e.id = 492),
    (e.ids = [492]),
    (e.modules = {
      485: () => {},
      756: (e, r, t) => {
        "use strict";
        t.d(r, { A: () => a });
        var n = t(1298),
          o = t(523),
          i = t(1492),
          s = t(2658);
        let l = (0, n.$)({ uri: "/graphql" }),
          d = (0, s.o)((e, { headers: r }) => ({
            headers: { ...r, authorization: "" },
          })),
          a = new o.R({
            link: d.concat(l),
            cache: new i.D(),
            defaultOptions: {
              watchQuery: { fetchPolicy: "cache-and-network" },
            },
          });
      },
      846: (e) => {
        "use strict";
        e.exports = require("next/dist/compiled/next-server/app-page.runtime.prod.js");
      },
      2142: (e, r, t) => {
        Promise.resolve().then(t.bind(t, 5500));
      },
      2506: (e, r, t) => {
        Promise.resolve().then(t.t.bind(t, 8416, 23)),
          Promise.resolve().then(t.t.bind(t, 7342, 23)),
          Promise.resolve().then(t.t.bind(t, 4078, 23)),
          Promise.resolve().then(t.t.bind(t, 4193, 23)),
          Promise.resolve().then(t.t.bind(t, 1573, 23)),
          Promise.resolve().then(t.t.bind(t, 5405, 23)),
          Promise.resolve().then(t.t.bind(t, 7301, 23)),
          Promise.resolve().then(t.t.bind(t, 6159, 23));
      },
      2593: (e, r, t) => {
        "use strict";
        t.r(r),
          t.d(r, {
            GlobalError: () => s.a,
            __next_app__: () => c,
            pages: () => u,
            routeModule: () => m,
            tree: () => a,
          });
        var n = t(5853),
          o = t(554),
          i = t(708),
          s = t.n(i),
          l = t(8067),
          d = {};
        for (let e in l)
          0 >
            [
              "default",
              "tree",
              "pages",
              "GlobalError",
              "__next_app__",
              "routeModule",
            ].indexOf(e) && (d[e] = () => l[e]);
        t.d(r, d);
        let a = {
            children: [
              "",
              {
                children: [
                  "/_not-found",
                  {
                    children: [
                      "__PAGE__",
                      {},
                      {
                        page: [
                          () => Promise.resolve().then(t.t.bind(t, 2192, 23)),
                          "next/dist/client/components/not-found-error",
                        ],
                      },
                    ],
                  },
                  {},
                ],
              },
              {
                layout: [
                  () => Promise.resolve().then(t.bind(t, 5347)),
                  "/home/agnes/Ricardo/WEDDING/noceflorale/frontend/src/app/layout.tsx",
                ],
                "not-found": [
                  () => Promise.resolve().then(t.t.bind(t, 2192, 23)),
                  "next/dist/client/components/not-found-error",
                ],
                forbidden: [
                  () => Promise.resolve().then(t.t.bind(t, 2137, 23)),
                  "next/dist/client/components/forbidden-error",
                ],
                unauthorized: [
                  () => Promise.resolve().then(t.t.bind(t, 8358, 23)),
                  "next/dist/client/components/unauthorized-error",
                ],
              },
            ],
          }.children,
          u = [],
          c = { require: t, loadChunk: () => Promise.resolve() },
          m = new n.AppPageRouteModule({
            definition: {
              kind: o.RouteKind.APP_PAGE,
              page: "/_not-found/page",
              pathname: "/_not-found",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: a },
          });
      },
      2731: (e, r, t) => {
        "use strict";
        t.d(r, { ClientProviders: () => n });
        let n = (0, t(413).registerClientReference)(
          function () {
            throw Error(
              "Attempted to call ClientProviders() from the server but ClientProviders is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
            );
          },
          "/home/agnes/Ricardo/WEDDING/noceflorale/frontend/src/providers/ClientProviders.tsx",
          "ClientProviders"
        );
      },
      3033: (e) => {
        "use strict";
        e.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");
      },
      3295: (e) => {
        "use strict";
        e.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");
      },
      3873: (e) => {
        "use strict";
        e.exports = require("path");
      },
      5347: (e, r, t) => {
        "use strict";
        t.r(r), t.d(r, { default: () => s, metadata: () => i });
        var n = t(7307);
        t(485);
        var o = t(2731);
        let i = {
          title: "Marie-Nella et Sidney - Mariage",
          description:
            "RSVP  en ligne pour le mariage de Marie-Nella et Sidney",
        };
        function s({ children: e }) {
          return (0, n.jsx)("html", {
            lang: "fr",
            className: "scroll-smooth",
            children: (0, n.jsx)("body", {
              children: (0, n.jsx)(o.ClientProviders, { children: e }),
            }),
          });
        }
      },
      5500: (e, r, t) => {
        "use strict";
        t.d(r, { ClientProviders: () => m });
        var n = t(8625),
          o = t(4996),
          i = t(6018),
          s = t(7972);
        function l({ children: e, defaultTheme: r = "system" }) {
          let [t, i] = (0, o.useState)(!1),
            { theme: l, setTheme: d } = (0, s.D)();
          return (0, n.jsx)(n.Fragment, { children: e });
        }
        var d = t(2167),
          a = t(756);
        function u({ children: e }) {
          return (0, n.jsx)(d.X, { client: a.A, children: e });
        }
        var c = t(2647);
        function m({ children: e }) {
          return (0, n.jsx)(l, {
            defaultTheme: "system",
            children: (0, n.jsx)(u, {
              children: (0, n.jsxs)(i.OJ, {
                children: [e, (0, n.jsx)(c.l$, { position: "top-right" })],
              }),
            }),
          });
        }
      },
      6018: (e, r, t) => {
        "use strict";
        t.d(r, { As: () => l, OJ: () => s });
        var n = t(8625),
          o = t(4996);
        let i = (0, o.createContext)(void 0),
          s = ({ children: e }) => {
            let [r, t] = (0, o.useState)(null),
              [s, l] = (0, o.useState)(!0);
            (0, o.useEffect)(() => {
              let e = localStorage.getItem("wedding_user");
              e && t(JSON.parse(e)), l(!1);
            }, []);
            let d = async (e) => {
                l(!0);
                try {
                  await new Promise((e) => setTimeout(e, 1e3));
                  let r =
                      e.includes("admin") ||
                      "sidney@example.com" === e ||
                      "marienelle@example.com" === e,
                    n = {
                      id: "1",
                      name: e.split("@")[0],
                      email: e,
                      role: r ? "admin" : "guest",
                    };
                  t(n), localStorage.setItem("wedding_user", JSON.stringify(n));
                } finally {
                  l(!1);
                }
              },
              a = async (e, r) => {
                l(!0);
                try {
                  await new Promise((e) => setTimeout(e, 1e3));
                  let n = { id: "1", name: e, email: r, role: "guest" };
                  t(n), localStorage.setItem("wedding_user", JSON.stringify(n));
                } finally {
                  l(!1);
                }
              },
              u = !!r && "admin" === r.role;
            return (0, n.jsx)(i.Provider, {
              value: {
                user: r,
                login: d,
                register: a,
                logout: () => {
                  t(null), localStorage.removeItem("wedding_user");
                },
                isLoading: s,
                isAdmin: u,
              },
              children: e,
            });
          },
          l = () => {
            let e = (0, o.useContext)(i);
            if (void 0 === e)
              throw Error("useAuth must be used within an AuthProvider");
            return e;
          };
      },
      6054: (e, r, t) => {
        Promise.resolve().then(t.bind(t, 2731));
      },
      8002: (e, r, t) => {
        Promise.resolve().then(t.t.bind(t, 9782, 23)),
          Promise.resolve().then(t.t.bind(t, 3552, 23)),
          Promise.resolve().then(t.t.bind(t, 708, 23)),
          Promise.resolve().then(t.t.bind(t, 7319, 23)),
          Promise.resolve().then(t.t.bind(t, 2079, 23)),
          Promise.resolve().then(t.t.bind(t, 868, 23)),
          Promise.resolve().then(t.t.bind(t, 5543, 23)),
          Promise.resolve().then(t.t.bind(t, 2241, 23));
      },
      9121: (e) => {
        "use strict";
        e.exports = require("next/dist/server/app-render/action-async-storage.external.js");
      },
      9294: (e) => {
        "use strict";
        e.exports = require("next/dist/server/app-render/work-async-storage.external.js");
      },
    });
  var r = require("../../webpack-runtime.js");
  r.C(e);
  var t = (e) => r((r.s = e)),
    n = r.X(0, [683, 484], () => t(2593));
  module.exports = n;
})();
