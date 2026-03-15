(() => {
  var e = {};
  (e.id = 698),
    (e.ids = [698]),
    (e.modules = {
      58: (e, t, s) => {
        "use strict";
        s.d(t, {
          ES: () => n,
          Px: () => l,
          Zj: () => i,
          _N: () => o,
          wZ: () => d,
        });
        var a = s(4212);
        let r = (0, a.J1)`
  fragment RsvpFields on PrimaryGuest {
    id
    name
    email
    attending
    guestType
    eventParticipation
    partnerName
    partnerEmail
    partnerEventParticipation
    hasChildren
    childrenCount
    children {
      id
      name
      age
    }
    # dietaryRequirements
    # notes
    createdAt
    updatedAt
  }
`;
        (0, a.J1)`
  query GetRsvp($id: ID!) {
    getRsvp(id: $id) {
      ...RsvpFields
    }
  }
  ${r}
`;
        let n = (0, a.J1)`
  query GetAllRsvps(
    $attending: AttendanceStatus
    $eventParticipation: EventParticipation
    $search: String
  ) {
    getAllRsvps(
      attending: $attending
      eventParticipation: $eventParticipation
      search: $search
    ) {
      ...RsvpFields
    }
  }
  ${r}
`,
          l = (0, a.J1)`
  query GetRsvpStats {
    getRsvpStats {
      totalGuests
      attending
      notAttending
      ceremonyOnly
      receptionOnly
      both
      totalAdults
      totalChildren
    }
  }
`,
          i = (0, a.J1)`
  mutation CreateRsvp($guest: PrimaryGuestInput!) {
    createRsvp(guest: $guest) {
      id
      name
      email
      attending
      guestType
      eventParticipation
      partnerName
      partnerEmail
      partnerEventParticipation
      hasChildren
      childrenCount
      children {
        id
        name
        age
      }
      createdAt
    }
  }
`,
          d = (0, a.J1)`
  mutation UpdateRsvp($id: ID!, $guest: PrimaryGuestInput!) {
    updateRsvp(id: $id, guest: $guest) {
      ...RsvpFields
    }
  }
  ${r}
`,
          o = (0, a.J1)`
  mutation DeleteRsvp($id: ID!) {
    deleteRsvp(id: $id)
  }
`;
      },
      180: (e, t, s) => {
        "use strict";
        s.d(t, { default: () => a });
        let a = (0, s(413).registerClientReference)(
          function () {
            throw Error(
              "Attempted to call the default export of \"/home/agnes/Ricardo/WEDDING/noceflorale/frontend/src/app/admin/admin-client-wrapper.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
            );
          },
          "/home/agnes/Ricardo/WEDDING/noceflorale/frontend/src/app/admin/admin-client-wrapper.tsx",
          "default"
        );
      },
      355: (e, t, s) => {
        "use strict";
        s.r(t), s.d(t, { default: () => a });
        let a = (0, s(413).registerClientReference)(
          function () {
            throw Error(
              "Attempted to call the default export of \"/home/agnes/Ricardo/WEDDING/noceflorale/frontend/src/app/admin/page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
            );
          },
          "/home/agnes/Ricardo/WEDDING/noceflorale/frontend/src/app/admin/page.tsx",
          "default"
        );
      },
      485: () => {},
      756: (e, t, s) => {
        "use strict";
        s.d(t, { A: () => o });
        var a = s(1298),
          r = s(523),
          n = s(1492),
          l = s(2658);
        let i = (0, a.$)({ uri: "/graphql" }),
          d = (0, l.o)((e, { headers: t }) => ({
            headers: { ...t, authorization: "" },
          })),
          o = new r.R({
            link: d.concat(i),
            cache: new n.D(),
            defaultOptions: {
              watchQuery: { fetchPolicy: "cache-and-network" },
            },
          });
      },
      846: (e) => {
        "use strict";
        e.exports = require("next/dist/compiled/next-server/app-page.runtime.prod.js");
      },
      927: (e, t, s) => {
        "use strict";
        s.d(t, { S0: () => r, je: () => n, qg: () => a });
        var a = (function (e) {
            return (e.YES = "attending"), (e.NO = "not_attending"), e;
          })({}),
          r = (function (e) {
            return (
              (e.NONE = "none"),
              (e.BOTH = "both"),
              (e.BLESSING_ONLY = "blessing_only"),
              (e.EVENING_ONLY = "evening_only"),
              e
            );
          })({}),
          n = (function (e) {
            return (e.SINGLE = "single"), (e.COUPLE = "couple"), e;
          })({});
      },
      2142: (e, t, s) => {
        Promise.resolve().then(s.bind(s, 5500));
      },
      2506: (e, t, s) => {
        Promise.resolve().then(s.t.bind(s, 8416, 23)),
          Promise.resolve().then(s.t.bind(s, 7342, 23)),
          Promise.resolve().then(s.t.bind(s, 4078, 23)),
          Promise.resolve().then(s.t.bind(s, 4193, 23)),
          Promise.resolve().then(s.t.bind(s, 1573, 23)),
          Promise.resolve().then(s.t.bind(s, 5405, 23)),
          Promise.resolve().then(s.t.bind(s, 7301, 23)),
          Promise.resolve().then(s.t.bind(s, 6159, 23));
      },
      2623: (e, t, s) => {
        Promise.resolve().then(s.bind(s, 8707));
      },
      2677: (e, t, s) => {
        "use strict";
        s.r(t),
          s.d(t, {
            GlobalError: () => l.a,
            __next_app__: () => m,
            pages: () => c,
            routeModule: () => x,
            tree: () => o,
          });
        var a = s(5853),
          r = s(554),
          n = s(708),
          l = s.n(n),
          i = s(8067),
          d = {};
        for (let e in i)
          0 >
            [
              "default",
              "tree",
              "pages",
              "GlobalError",
              "__next_app__",
              "routeModule",
            ].indexOf(e) && (d[e] = () => i[e]);
        s.d(t, d);
        let o = {
            children: [
              "",
              {
                children: [
                  "admin",
                  {
                    children: [
                      "__PAGE__",
                      {},
                      {
                        page: [
                          () => Promise.resolve().then(s.bind(s, 355)),
                          "/home/agnes/Ricardo/WEDDING/noceflorale/frontend/src/app/admin/page.tsx",
                        ],
                      },
                    ],
                  },
                  {
                    layout: [
                      () => Promise.resolve().then(s.bind(s, 4395)),
                      "/home/agnes/Ricardo/WEDDING/noceflorale/frontend/src/app/admin/layout.tsx",
                    ],
                    metadata: {
                      icon: [
                        async (e) =>
                          (
                            await Promise.resolve().then(s.bind(s, 4638))
                          ).default(e),
                      ],
                      apple: [],
                      openGraph: [],
                      twitter: [],
                      manifest: void 0,
                    },
                  },
                ],
              },
              {
                layout: [
                  () => Promise.resolve().then(s.bind(s, 5347)),
                  "/home/agnes/Ricardo/WEDDING/noceflorale/frontend/src/app/layout.tsx",
                ],
                "not-found": [
                  () => Promise.resolve().then(s.t.bind(s, 2192, 23)),
                  "next/dist/client/components/not-found-error",
                ],
                forbidden: [
                  () => Promise.resolve().then(s.t.bind(s, 2137, 23)),
                  "next/dist/client/components/forbidden-error",
                ],
                unauthorized: [
                  () => Promise.resolve().then(s.t.bind(s, 8358, 23)),
                  "next/dist/client/components/unauthorized-error",
                ],
                metadata: {
                  icon: [
                    async (e) =>
                      (await Promise.resolve().then(s.bind(s, 4638))).default(
                        e
                      ),
                  ],
                  apple: [],
                  openGraph: [],
                  twitter: [],
                  manifest: void 0,
                },
              },
            ],
          }.children,
          c = [
            "/home/agnes/Ricardo/WEDDING/noceflorale/frontend/src/app/admin/page.tsx",
          ],
          m = { require: s, loadChunk: () => Promise.resolve() },
          x = new a.AppPageRouteModule({
            definition: {
              kind: r.RouteKind.APP_PAGE,
              page: "/admin/page",
              pathname: "/admin",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: o },
          });
      },
      2731: (e, t, s) => {
        "use strict";
        s.d(t, { ClientProviders: () => a });
        let a = (0, s(413).registerClientReference)(
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
      4395: (e, t, s) => {
        "use strict";
        s.r(t), s.d(t, { default: () => l, metadata: () => n });
        var a = s(7307),
          r = s(180);
        let n = {
          title: "Admin Dashboard | Marie-Nella et Sidney Wedding",
          description:
            "Admin dashboard for managing RSVPs and guest information",
        };
        function l({ children: e }) {
          return (0, a.jsx)(r.default, { children: e });
        }
      },
      4638: (e, t, s) => {
        "use strict";
        s.r(t), s.d(t, { default: () => r });
        var a = s(1808);
        let r = async (e) => [
          {
            type: "image/x-icon",
            sizes: "16x16",
            url:
              (0, a.fillMetadataSegment)(".", await e.params, "favicon.ico") +
              "",
          },
        ];
      },
      4832: (e, t, s) => {
        "use strict";
        s.d(t, { default: () => o });
        var a = s(8625),
          r = s(6018),
          n = s(6575);
        s(4996);
        var l = s(2167),
          i = s(756),
          d = s(2647);
        function o({ children: e }) {
          let { user: t, isAdmin: s, isLoading: o } = (0, r.As)(),
            c = (0, n.useRouter)();
          return o
            ? (0, a.jsx)("div", {
                className: "flex items-center justify-center min-h-screen",
                children: (0, a.jsxs)("div", {
                  className: "text-center",
                  children: [
                    (0, a.jsx)("div", {
                      className:
                        "animate-spin h-8 w-8 border-4 border-royal-600 rounded-full border-t-transparent",
                    }),
                    (0, a.jsx)("p", {
                      className: "mt-4 text-gray-600",
                      children: "Verifying access...",
                    }),
                  ],
                }),
              })
            : t && s
            ? (0, a.jsx)(l.X, {
                client: i.A,
                children: (0, a.jsx)("div", {
                  className: "min-h-screen bg-gray-50",
                  children: (0, a.jsxs)("div", {
                    className: "flex flex-col",
                    children: [
                      (0, a.jsx)("main", { className: "flex-1", children: e }),
                      (0, a.jsx)(d.l$, { position: "top-right" }),
                    ],
                  }),
                }),
              })
            : (0, a.jsx)("div", {
                className: "flex min-h-screen items-center justify-center",
                children: (0, a.jsxs)("div", {
                  className: "text-center",
                  children: [
                    (0, a.jsx)("h1", {
                      className: "text-2xl font-bold text-red-600",
                      children: "Access Denied",
                    }),
                    (0, a.jsx)("p", {
                      className: "mt-2 text-gray-600",
                      children:
                        "You don't have permission to access this page.",
                    }),
                    (0, a.jsx)("button", {
                      onClick: () => c.push("/"),
                      className:
                        "mt-4 px-4 py-2 bg-royal-600 text-white rounded-md",
                      children: "Return to Homepage",
                    }),
                  ],
                }),
              });
        }
      },
      5347: (e, t, s) => {
        "use strict";
        s.r(t), s.d(t, { default: () => l, metadata: () => n });
        var a = s(7307);
        s(485);
        var r = s(2731);
        let n = {
          title: "Marie-Nella et Sidney - Mariage",
          description:
            "RSVP  en ligne pour le mariage de Marie-Nella et Sidney",
        };
        function l({ children: e }) {
          return (0, a.jsx)("html", {
            lang: "fr",
            className: "scroll-smooth",
            children: (0, a.jsx)("body", {
              children: (0, a.jsx)(r.ClientProviders, { children: e }),
            }),
          });
        }
      },
      5500: (e, t, s) => {
        "use strict";
        s.d(t, { ClientProviders: () => x });
        var a = s(8625),
          r = s(4996),
          n = s(6018),
          l = s(7972);
        function i({ children: e, defaultTheme: t = "system" }) {
          let [s, n] = (0, r.useState)(!1),
            { theme: i, setTheme: d } = (0, l.D)();
          return (0, a.jsx)(a.Fragment, { children: e });
        }
        var d = s(2167),
          o = s(756);
        function c({ children: e }) {
          return (0, a.jsx)(d.X, { client: o.A, children: e });
        }
        var m = s(2647);
        function x({ children: e }) {
          return (0, a.jsx)(i, {
            defaultTheme: "system",
            children: (0, a.jsx)(c, {
              children: (0, a.jsxs)(n.OJ, {
                children: [e, (0, a.jsx)(m.l$, { position: "top-right" })],
              }),
            }),
          });
        }
      },
      6018: (e, t, s) => {
        "use strict";
        s.d(t, { As: () => i, OJ: () => l });
        var a = s(8625),
          r = s(4996);
        let n = (0, r.createContext)(void 0),
          l = ({ children: e }) => {
            let [t, s] = (0, r.useState)(null),
              [l, i] = (0, r.useState)(!0);
            (0, r.useEffect)(() => {
              let e = localStorage.getItem("wedding_user");
              e && s(JSON.parse(e)), i(!1);
            }, []);
            let d = async (e) => {
                i(!0);
                try {
                  await new Promise((e) => setTimeout(e, 1e3));
                  let t =
                      e.includes("admin") ||
                      "sidney@example.com" === e ||
                      "marienelle@example.com" === e,
                    a = {
                      id: "1",
                      name: e.split("@")[0],
                      email: e,
                      role: t ? "admin" : "guest",
                    };
                  s(a), localStorage.setItem("wedding_user", JSON.stringify(a));
                } finally {
                  i(!1);
                }
              },
              o = async (e, t) => {
                i(!0);
                try {
                  await new Promise((e) => setTimeout(e, 1e3));
                  let a = { id: "1", name: e, email: t, role: "guest" };
                  s(a), localStorage.setItem("wedding_user", JSON.stringify(a));
                } finally {
                  i(!1);
                }
              },
              c = !!t && "admin" === t.role;
            return (0, a.jsx)(n.Provider, {
              value: {
                user: t,
                login: d,
                register: o,
                logout: () => {
                  s(null), localStorage.removeItem("wedding_user");
                },
                isLoading: l,
                isAdmin: c,
              },
              children: e,
            });
          },
          i = () => {
            let e = (0, r.useContext)(n);
            if (void 0 === e)
              throw Error("useAuth must be used within an AuthProvider");
            return e;
          };
      },
      6054: (e, t, s) => {
        Promise.resolve().then(s.bind(s, 2731));
      },
      7895: (e, t, s) => {
        Promise.resolve().then(s.bind(s, 355));
      },
      8002: (e, t, s) => {
        Promise.resolve().then(s.t.bind(s, 9782, 23)),
          Promise.resolve().then(s.t.bind(s, 3552, 23)),
          Promise.resolve().then(s.t.bind(s, 708, 23)),
          Promise.resolve().then(s.t.bind(s, 7319, 23)),
          Promise.resolve().then(s.t.bind(s, 2079, 23)),
          Promise.resolve().then(s.t.bind(s, 868, 23)),
          Promise.resolve().then(s.t.bind(s, 5543, 23)),
          Promise.resolve().then(s.t.bind(s, 2241, 23));
      },
      8707: (e, t, s) => {
        "use strict";
        s.r(t), s.d(t, { default: () => ea });
        var a = s(8625),
          r = s(6018),
          n = s(1567),
          l = s.n(n),
          i = s(5215),
          d = s(9234),
          o = s(3922);
        let c = (0, o.A)("file-text", [
          [
            "path",
            {
              d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
              key: "1rqfz7",
            },
          ],
          ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
          ["path", { d: "M10 9H8", key: "b1mrlr" }],
          ["path", { d: "M16 13H8", key: "t4e002" }],
          ["path", { d: "M16 17H8", key: "z1uh3a" }],
        ]);
        var m = s(9965);
        let x = (0, o.A)("search", [
          ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
          ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }],
        ]);
        var u = s(5818);
        let h = (0, o.A)("eye", [
          [
            "path",
            {
              d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
              key: "1nclc0",
            },
          ],
          ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
        ]);
        var p = s(8837),
          g = s(1275);
        let v = (0, o.A)("download", [
          [
            "path",
            { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" },
          ],
          ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
          ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }],
        ]);
        var b = s(7019);
        let y = (0, o.A)("save", [
          [
            "path",
            {
              d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
              key: "1c8476",
            },
          ],
          [
            "path",
            { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" },
          ],
          ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }],
        ]);
        var f = s(4996),
          j = s(7577),
          N = s(8084),
          w = s(8672),
          P = s.t(w, 2),
          C = s(3817),
          E = !1,
          R =
            P.useSyncExternalStore ||
            function (e, t, s) {
              var a = t();
              !1 === globalThis.__DEV__ ||
                E ||
                a === t() ||
                ((E = !0), !1 !== globalThis.__DEV__ && N.V1.error(68));
              var r = w.useState({ inst: { value: a, getSnapshot: t } }),
                n = r[0].inst,
                l = r[1];
              return (
                C.JR
                  ? w.useLayoutEffect(
                      function () {
                        Object.assign(n, { value: a, getSnapshot: t }),
                          S(n) && l({ inst: n });
                      },
                      [e, a, t]
                    )
                  : Object.assign(n, { value: a, getSnapshot: t }),
                w.useEffect(
                  function () {
                    return (
                      S(n) && l({ inst: n }),
                      e(function () {
                        S(n) && l({ inst: n });
                      })
                    );
                  },
                  [e]
                ),
                a
              );
            };
        function S(e) {
          var t = e.value,
            s = e.getSnapshot;
          try {
            return t !== s();
          } catch (e) {
            return !0;
          }
        }
        var A = s(8287),
          k = s(7998),
          O = s(7719),
          D = s(4705),
          _ = s(7170),
          G = s(5861),
          $ = s(1565),
          I = s(3537),
          T = s(4823),
          q = s(7750),
          L = s(9519),
          V = Symbol.for("apollo.hook.wrappers"),
          z = Object.prototype.hasOwnProperty;
        function M() {}
        var F = Symbol();
        function B(e, t) {
          var s, a, r, n;
          return (
            void 0 === t && (t = Object.create(null)),
            ((s = Q),
            (n =
              (r = (a = (0, I.m)(t && t.client).queryManager) && a[V]) &&
              r.useQuery)
              ? n(s)
              : s)(e, t)
          );
        }
        function Q(e, t) {
          var s,
            a,
            r,
            n,
            l,
            i,
            d,
            o,
            c,
            m,
            x,
            u,
            h,
            p,
            g,
            v,
            b,
            y,
            f,
            N,
            P,
            C,
            E,
            S,
            k,
            D,
            T,
            q,
            L,
            V,
            B,
            Q,
            X,
            ee,
            et,
            es,
            ea,
            er,
            en,
            el,
            ei,
            ed,
            eo,
            ec,
            em,
            ex =
              ((s = e),
              (a = t),
              (m = (0, I.m)(a.client)),
              (u = !!(x = w.useContext((0, O.l)()).renderPromises)),
              (h = m.disableNetworkFetches),
              (p = !1 !== a.ssr && !a.skip),
              (g = a.partialRefetch),
              (v =
                ((r = m),
                (n = s),
                (l = a),
                (i = u),
                void 0 === l && (l = {}),
                (d = l.skip),
                (o = (l.ssr, l.onCompleted, l.onError, l.defaultOptions)),
                (c = (0, j.Tt)(l, [
                  "skip",
                  "ssr",
                  "onCompleted",
                  "onError",
                  "defaultOptions",
                ])),
                function (e) {
                  var t = Object.assign(c, { query: n });
                  return (
                    i &&
                      ("network-only" === t.fetchPolicy ||
                        "cache-and-network" === t.fetchPolicy) &&
                      (t.fetchPolicy = "cache-first"),
                    t.variables || (t.variables = {}),
                    d
                      ? ((t.initialFetchPolicy =
                          t.initialFetchPolicy ||
                          t.fetchPolicy ||
                          Y(o, r.defaultOptions)),
                        (t.fetchPolicy = "standby"))
                      : t.fetchPolicy ||
                        (t.fetchPolicy =
                          (null == e ? void 0 : e.options.initialFetchPolicy) ||
                          Y(o, r.defaultOptions)),
                    t
                  );
                })),
              (f = (y = (b = (function (e, t, s, a, r) {
                function n(n) {
                  var l;
                  return (
                    (0, $.D$)(t, $.KG.Query),
                    {
                      client: e,
                      query: t,
                      observable:
                        (a && a.getSSRObservable(r())) ||
                        _.U.inactiveOnCreation.withValue(!a, function () {
                          return e.watchQuery(J(void 0, e, s, r()));
                        }),
                      resultData: {
                        previousData:
                          null ===
                            (l = null == n ? void 0 : n.resultData.current) ||
                          void 0 === l
                            ? void 0
                            : l.data,
                      },
                    }
                  );
                }
                var l = w.useState(n),
                  i = l[0],
                  d = l[1];
                function o(e) {
                  Object.assign(i.observable, (((t = {})[F] = e), t));
                  var t,
                    s,
                    a = i.resultData;
                  d(
                    (0, j.Cl)((0, j.Cl)({}, i), {
                      query: e.query,
                      resultData: Object.assign(a, {
                        previousData:
                          (null === (s = a.current) || void 0 === s
                            ? void 0
                            : s.data) || a.previousData,
                        current: void 0,
                      }),
                    })
                  );
                }
                if (e !== i.client || t !== i.query) {
                  var c = n(i);
                  return d(c), [c, o];
                }
                return [i, o];
              })(m, s, a, x, v))[0]).observable),
              (N = y.resultData),
              (P = b[1]),
              (C = v(f)),
              (E = N),
              (S = f),
              (k = m),
              (D = a),
              (T = C),
              S[F] &&
                !(0, A.L)(S[F], T) &&
                (S.reobserve(J(S, k, D, T)),
                (E.previousData =
                  (null === (q = E.current) || void 0 === q
                    ? void 0
                    : q.data) || E.previousData),
                (E.current = void 0)),
              (S[F] = T),
              (L = w.useMemo(
                function () {
                  var e;
                  return {
                    refetch: (e = f).refetch.bind(e),
                    reobserve: e.reobserve.bind(e),
                    fetchMore: e.fetchMore.bind(e),
                    updateQuery: e.updateQuery.bind(e),
                    startPolling: e.startPolling.bind(e),
                    stopPolling: e.stopPolling.bind(e),
                    subscribeToMore: e.subscribeToMore.bind(e),
                  };
                },
                [f]
              )),
              (V = f),
              (B = x),
              (Q = p),
              B &&
                Q &&
                (B.registerSSRObservable(V),
                V.getCurrentResult().loading && B.addObservableQueryPromise(V)),
              {
                result:
                  ((X = N),
                  (ee = f),
                  (et = m),
                  (es = a),
                  (ea = C),
                  (er = h),
                  (en = g),
                  (el = u),
                  (ei = {
                    onCompleted: a.onCompleted || M,
                    onError: a.onError || M,
                  }),
                  (ed = w.useRef(ei)),
                  w.useEffect(function () {
                    ed.current = ei;
                  }),
                  (eo =
                    (el || er) && !1 === es.ssr && !es.skip
                      ? K
                      : es.skip || "standby" === ea.fetchPolicy
                      ? Z
                      : void 0),
                  (ec = X.previousData),
                  (em = w.useMemo(
                    function () {
                      return eo && U(eo, ec, ee, et);
                    },
                    [et, ee, eo, ec]
                  )),
                  R(
                    w.useCallback(
                      function (e) {
                        if (el) return function () {};
                        var t = function () {
                            var t = X.current,
                              s = ee.getCurrentResult();
                            !(
                              t &&
                              t.loading === s.loading &&
                              t.networkStatus === s.networkStatus &&
                              (0, A.L)(t.data, s.data)
                            ) && H(s, X, ee, et, en, e, ed.current);
                          },
                          s = function (r) {
                            if (
                              (a.current.unsubscribe(),
                              (a.current = ee.resubscribeAfterError(t, s)),
                              !z.call(r, "graphQLErrors"))
                            )
                              throw r;
                            var n = X.current;
                            (!n || (n && n.loading) || !(0, A.L)(r, n.error)) &&
                              H(
                                {
                                  data: n && n.data,
                                  error: r,
                                  loading: !1,
                                  networkStatus: G.pT.error,
                                },
                                X,
                                ee,
                                et,
                                en,
                                e,
                                ed.current
                              );
                          },
                          a = { current: ee.subscribe(t, s) };
                        return function () {
                          setTimeout(function () {
                            return a.current.unsubscribe();
                          });
                        };
                      },
                      [er, el, ee, X, en, et]
                    ),
                    function () {
                      return em || W(X, ee, ed.current, en, et);
                    },
                    function () {
                      return em || W(X, ee, ed.current, en, et);
                    }
                  )),
                obsQueryFields: L,
                observable: f,
                resultData: N,
                client: m,
                onQueryExecuted: P,
              }),
            eu = ex.result,
            eh = ex.obsQueryFields;
          return w.useMemo(
            function () {
              return (0, j.Cl)((0, j.Cl)({}, eu), eh);
            },
            [eu, eh]
          );
        }
        function J(e, t, s, a) {
          var r = [],
            n = t.defaultOptions.watchQuery;
          return (
            n && r.push(n),
            s.defaultOptions && r.push(s.defaultOptions),
            r.push((0, T.o)(e && e.options, a)),
            r.reduce(k.l)
          );
        }
        function H(e, t, s, a, r, n, l) {
          var i,
            d,
            o,
            c = t.current;
          c && c.data && (t.previousData = c.data),
            !e.error &&
              (0, q.E)(e.errors) &&
              (e.error = new D.K4({ graphQLErrors: e.errors })),
            (t.current = U(
              ((i = e),
              (d = s),
              (o = r),
              i.partial &&
              o &&
              !i.loading &&
              (!i.data || 0 === Object.keys(i.data).length) &&
              "cache-only" !== d.options.fetchPolicy
                ? (d.refetch(),
                  (0, j.Cl)((0, j.Cl)({}, i), {
                    loading: !0,
                    networkStatus: G.pT.refetch,
                  }))
                : i),
              t.previousData,
              s,
              a
            )),
            n(),
            (function (e, t, s) {
              if (!e.loading) {
                var a,
                  r =
                    ((a = e),
                    (0, q.E)(a.errors)
                      ? new D.K4({ graphQLErrors: a.errors })
                      : a.error);
                Promise.resolve()
                  .then(function () {
                    r
                      ? s.onError(r)
                      : e.data &&
                        t !== e.networkStatus &&
                        e.networkStatus === G.pT.ready &&
                        s.onCompleted(e.data);
                  })
                  .catch(function (e) {
                    !1 !== globalThis.__DEV__ && N.V1.warn(e);
                  });
              }
            })(e, null == c ? void 0 : c.networkStatus, l);
        }
        function W(e, t, s, a, r) {
          return (
            e.current || H(t.getCurrentResult(), e, t, r, a, function () {}, s),
            e.current
          );
        }
        function Y(e, t) {
          var s;
          return (
            (null == e ? void 0 : e.fetchPolicy) ||
            (null === (s = null == t ? void 0 : t.watchQuery) || void 0 === s
              ? void 0
              : s.fetchPolicy) ||
            "cache-first"
          );
        }
        function U(e, t, s, a) {
          var r = e.data,
            n = (e.partial, (0, j.Tt)(e, ["data", "partial"]));
          return (0, j.Cl)((0, j.Cl)({ data: r }, n), {
            client: a,
            observable: s,
            variables: s.variables,
            called: e !== K && e !== Z,
            previousData: t,
          });
        }
        var K = (0, L.G)({
            loading: !0,
            data: void 0,
            error: void 0,
            networkStatus: G.pT.loading,
          }),
          Z = (0, L.G)({
            loading: !1,
            data: void 0,
            error: void 0,
            networkStatus: G.pT.ready,
          }),
          X = s(880),
          ee = s(58),
          et = s(2647),
          es = s(927);
        function ea() {
          let { user: e } = (0, r.As)(),
            [t, s] = (0, f.useState)("dashboard"),
            [n, o] = (0, f.useState)("all"),
            [j, N] = (0, f.useState)("all"),
            [w, P] = (0, f.useState)(""),
            [C, E] = (0, f.useState)(null),
            [R, S] = (0, f.useState)(!1),
            [A, k] = (0, f.useState)(!1),
            [O, D] = (0, f.useState)(null),
            { data: _, loading: G, error: $, refetch: I } = B(ee.Px),
            T = (0, f.useCallback)(() => {
              let e = {};
              return (
                "all" !== n && (e.attending = n),
                "all" !== j && (e.eventParticipation = j),
                w.trim() && (e.search = w.trim()),
                e
              );
            }, [n, j, w]),
            {
              data: q,
              loading: L,
              error: V,
              refetch: z,
            } = B(ee.ES, { variables: T(), fetchPolicy: "cache-and-network" }),
            [M, { loading: F }] = (0, X.n)(ee.wZ, {
              onCompleted: () => {
                et.oR.success("RSVP updated successfully"),
                  S(!1),
                  k(!1),
                  z(),
                  I();
              },
              onError: (e) => {
                et.oR.error("Failed to update RSVP", {
                  description: e.message,
                });
              },
            }),
            [Q, { loading: J }] = (0, X.n)(ee._N, {
              onCompleted: () => {
                et.oR.success("RSVP deleted successfully"), S(!1), z(), I();
              },
              onError: (e) => {
                et.oR.error("Failed to delete RSVP", {
                  description: e.message,
                });
              },
            }),
            H = (e) => {
              E(e), D({ ...e }), S(!0), k(!1);
            },
            W = (e) => {
              e?.id &&
                confirm(
                  `Are you sure you want to delete the RSVP for ${e.name}?`
                ) &&
                Q({ variables: { id: e.id } });
            },
            Y = _?.getRsvpStats || {
              totalGuests: 0,
              attending: 0,
              notAttending: 0,
              ceremonyOnly: 0,
              receptionOnly: 0,
              both: 0,
              totalAdults: 0,
              totalChildren: 0,
            };
          return (0, a.jsxs)("div", {
            className: "flex min-h-screen",
            children: [
              (0, a.jsxs)("div", {
                className: "w-64 bg-royal-600 text-white min-h-screen p-4",
                children: [
                  (0, a.jsxs)("div", {
                    className: "mb-8",
                    children: [
                      (0, a.jsx)("h2", {
                        className: "text-xl font-playfair font-bold",
                        children: "Admin Dashboard",
                      }),
                      (0, a.jsxs)("p", {
                        className: "text-sm text-royal-200",
                        children: ["Welcome, ", e?.name],
                      }),
                    ],
                  }),
                  (0, a.jsxs)("nav", {
                    className: "space-y-2",
                    children: [
                      (0, a.jsxs)("button", {
                        onClick: () => s("dashboard"),
                        className: `w-full flex items-center gap-2 p-2 rounded-lg text-left ${
                          "dashboard" === t
                            ? "bg-royal-700"
                            : "hover:bg-royal-500"
                        }`,
                        children: [(0, a.jsx)(i.A, { size: 18 }), "Dashboard"],
                      }),
                      (0, a.jsxs)("button", {
                        onClick: () => s("guests"),
                        className: `w-full flex items-center gap-2 p-2 rounded-lg text-left ${
                          "guests" === t ? "bg-royal-700" : "hover:bg-royal-500"
                        }`,
                        children: [(0, a.jsx)(d.A, { size: 18 }), "Guest List"],
                      }),
                      (0, a.jsxs)("button", {
                        onClick: () => s("export"),
                        className: `w-full flex items-center gap-2 p-2 rounded-lg text-left ${
                          "export" === t ? "bg-royal-700" : "hover:bg-royal-500"
                        }`,
                        children: [(0, a.jsx)(c, { size: 18 }), "Export Data"],
                      }),
                    ],
                  }),
                  (0, a.jsx)("div", {
                    className: "absolute bottom-8",
                    children: (0, a.jsxs)(l(), {
                      href: "/",
                      className:
                        "flex items-center gap-2 text-royal-200 hover:text-white",
                      children: [
                        (0, a.jsx)(m.A, { size: 16 }),
                        "Back to Website",
                      ],
                    }),
                  }),
                ],
              }),
              (0, a.jsxs)("div", {
                className: "flex-1 p-6",
                children: [
                  "dashboard" === t &&
                    (0, a.jsxs)("div", {
                      children: [
                        (0, a.jsx)("h1", {
                          className: "text-2xl font-playfair font-bold mb-6",
                          children: "Dashboard Overview",
                        }),
                        $ &&
                          (0, a.jsxs)("div", {
                            className:
                              "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6",
                            children: [
                              (0, a.jsx)("p", {
                                className: "font-medium",
                                children: "Error loading statistics",
                              }),
                              (0, a.jsx)("p", {
                                className: "text-sm",
                                children:
                                  $.message ||
                                  "Failed to load dashboard statistics. Please try again.",
                              }),
                            ],
                          }),
                        (0, a.jsxs)("div", {
                          className:
                            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8",
                          children: [
                            (0, a.jsxs)("div", {
                              className: "bg-white p-4 rounded-lg shadow",
                              children: [
                                (0, a.jsx)("h3", {
                                  className: "text-sm text-gray-500 mb-1",
                                  children: "Total RSVPs",
                                }),
                                (0, a.jsx)("p", {
                                  className: "text-2xl font-bold",
                                  children: Y.totalGuests,
                                }),
                                G &&
                                  (0, a.jsx)("span", {
                                    className: "text-xs text-gray-400",
                                    children: "Loading...",
                                  }),
                              ],
                            }),
                            (0, a.jsxs)("div", {
                              className: "bg-white p-4 rounded-lg shadow",
                              children: [
                                (0, a.jsx)("h3", {
                                  className: "text-sm text-gray-500 mb-1",
                                  children: "Attending",
                                }),
                                (0, a.jsx)("p", {
                                  className:
                                    "text-2xl font-bold text-green-600",
                                  children: Y.attending,
                                }),
                                G &&
                                  (0, a.jsx)("span", {
                                    className: "text-xs text-gray-400",
                                    children: "Loading...",
                                  }),
                              ],
                            }),
                            (0, a.jsxs)("div", {
                              className: "bg-white p-4 rounded-lg shadow",
                              children: [
                                (0, a.jsx)("h3", {
                                  className: "text-sm text-gray-500 mb-1",
                                  children: "Not Attending",
                                }),
                                (0, a.jsx)("p", {
                                  className: "text-2xl font-bold text-red-600",
                                  children: Y.notAttending,
                                }),
                                G &&
                                  (0, a.jsx)("span", {
                                    className: "text-xs text-gray-400",
                                    children: "Loading...",
                                  }),
                              ],
                            }),
                            (0, a.jsxs)("div", {
                              className: "bg-white p-4 rounded-lg shadow",
                              children: [
                                (0, a.jsx)("h3", {
                                  className: "text-sm text-gray-500 mb-1",
                                  children: "Total Guests",
                                }),
                                (0, a.jsx)("p", {
                                  className: "text-2xl font-bold",
                                  children: Y.totalAdults + Y.totalChildren,
                                }),
                                (0, a.jsxs)("div", {
                                  className: "flex text-xs mt-1",
                                  children: [
                                    (0, a.jsxs)("span", {
                                      className: "text-gray-500 mr-2",
                                      children: ["Adults: ", Y.totalAdults],
                                    }),
                                    (0, a.jsxs)("span", {
                                      className: "text-gray-500",
                                      children: ["Children: ", Y.totalChildren],
                                    }),
                                  ],
                                }),
                                G &&
                                  (0, a.jsx)("span", {
                                    className: "text-xs text-gray-400",
                                    children: "Loading...",
                                  }),
                              ],
                            }),
                          ],
                        }),
                        (0, a.jsxs)("div", {
                          className: "bg-white p-6 rounded-lg shadow mb-8",
                          children: [
                            (0, a.jsx)("h2", {
                              className: "text-lg font-medium mb-4",
                              children: "Event Participation",
                            }),
                            $
                              ? (0, a.jsx)("div", {
                                  className:
                                    "p-4 bg-red-50 rounded-lg text-center",
                                  children: (0, a.jsx)("p", {
                                    className: "text-red-600",
                                    children:
                                      "Failed to load event participation data",
                                  }),
                                })
                              : (0, a.jsxs)("div", {
                                  className:
                                    "grid grid-cols-1 md:grid-cols-3 gap-4",
                                  children: [
                                    (0, a.jsxs)("div", {
                                      className:
                                        "text-center p-4 bg-blue-50 rounded-lg",
                                      children: [
                                        (0, a.jsx)("p", {
                                          className: "text-sm text-gray-500",
                                          children: "Ceremony Only",
                                        }),
                                        (0, a.jsx)("p", {
                                          className:
                                            "text-xl font-bold text-royal-600",
                                          children: Y.ceremonyOnly,
                                        }),
                                        G &&
                                          (0, a.jsx)("span", {
                                            className: "text-xs text-gray-400",
                                            children: "Loading...",
                                          }),
                                      ],
                                    }),
                                    (0, a.jsxs)("div", {
                                      className:
                                        "text-center p-4 bg-blue-50 rounded-lg",
                                      children: [
                                        (0, a.jsx)("p", {
                                          className: "text-sm text-gray-500",
                                          children: "Reception Only",
                                        }),
                                        (0, a.jsx)("p", {
                                          className:
                                            "text-xl font-bold text-royal-600",
                                          children: Y.receptionOnly,
                                        }),
                                        G &&
                                          (0, a.jsx)("span", {
                                            className: "text-xs text-gray-400",
                                            children: "Loading...",
                                          }),
                                      ],
                                    }),
                                    (0, a.jsxs)("div", {
                                      className:
                                        "text-center p-4 bg-blue-50 rounded-lg",
                                      children: [
                                        (0, a.jsx)("p", {
                                          className: "text-sm text-gray-500",
                                          children: "Both Events",
                                        }),
                                        (0, a.jsx)("p", {
                                          className:
                                            "text-xl font-bold text-royal-600",
                                          children: Y.both,
                                        }),
                                        G &&
                                          (0, a.jsx)("span", {
                                            className: "text-xs text-gray-400",
                                            children: "Loading...",
                                          }),
                                      ],
                                    }),
                                  ],
                                }),
                          ],
                        }),
                        (0, a.jsxs)("div", {
                          className: "bg-white p-6 rounded-lg shadow",
                          children: [
                            (0, a.jsx)("h2", {
                              className: "text-lg font-medium mb-4",
                              children: "Recent RSVPs",
                            }),
                            $
                              ? (0, a.jsxs)("p", {
                                  className: "text-red-500",
                                  children: [
                                    "Error loading recent RSVPs: ",
                                    $.message,
                                  ],
                                })
                              : _?.getRsvpStats?.totalGuests === 0
                              ? (0, a.jsx)("p", {
                                  className: "text-gray-500 italic",
                                  children: "No RSVPs submitted yet.",
                                })
                              : (0, a.jsx)("p", {
                                  className: "text-gray-500 italic",
                                  children:
                                    "Recent RSVP data will appear here.",
                                }),
                          ],
                        }),
                      ],
                    }),
                  "guests" === t &&
                    (0, a.jsxs)("div", {
                      children: [
                        (0, a.jsx)("h1", {
                          className: "text-2xl font-playfair font-bold mb-6",
                          children: "Guest List",
                        }),
                        (0, a.jsx)("div", {
                          className: "bg-white p-4 rounded-lg shadow mb-4",
                          children: (0, a.jsxs)("div", {
                            className: "flex flex-wrap gap-4",
                            children: [
                              (0, a.jsxs)("div", {
                                className: "w-full md:w-auto",
                                children: [
                                  (0, a.jsx)("label", {
                                    className:
                                      "block text-sm font-medium text-gray-700 mb-1",
                                    children: "Filter by Status",
                                  }),
                                  (0, a.jsxs)("select", {
                                    className:
                                      "border rounded-md px-3 py-2 w-full",
                                    value: n,
                                    onChange: (e) => o(e.target.value),
                                    children: [
                                      (0, a.jsx)("option", {
                                        value: "all",
                                        children: "All",
                                      }),
                                      (0, a.jsx)("option", {
                                        value: "attending",
                                        children: "Attending",
                                      }),
                                      (0, a.jsx)("option", {
                                        value: "not_attending",
                                        children: "Not Attending",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              (0, a.jsxs)("div", {
                                className: "w-full md:w-auto",
                                children: [
                                  (0, a.jsx)("label", {
                                    className:
                                      "block text-sm font-medium text-gray-700 mb-1",
                                    children: "Filter by Event",
                                  }),
                                  (0, a.jsxs)("select", {
                                    className:
                                      "border rounded-md px-3 py-2 w-full",
                                    value: j,
                                    onChange: (e) => N(e.target.value),
                                    children: [
                                      (0, a.jsx)("option", {
                                        value: "all",
                                        children: "All",
                                      }),
                                      (0, a.jsx)("option", {
                                        value: "both",
                                        children: "Both Events",
                                      }),
                                      (0, a.jsx)("option", {
                                        value: "blessing_only",
                                        children: "Ceremony Only",
                                      }),
                                      (0, a.jsx)("option", {
                                        value: "evening_only",
                                        children: "Reception Only",
                                      }),
                                      (0, a.jsx)("option", {
                                        value: "none",
                                        children: "None",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              (0, a.jsxs)("div", {
                                className: "w-full md:w-auto flex-grow",
                                children: [
                                  (0, a.jsx)("label", {
                                    className:
                                      "block text-sm font-medium text-gray-700 mb-1",
                                    children: "Search",
                                  }),
                                  (0, a.jsxs)("div", {
                                    className: "relative",
                                    children: [
                                      (0, a.jsx)("input", {
                                        type: "text",
                                        placeholder: "Search by name or email",
                                        className:
                                          "border rounded-md pl-10 pr-3 py-2 w-full",
                                        value: w,
                                        onChange: (e) => P(e.target.value),
                                      }),
                                      (0, a.jsx)(x, {
                                        className:
                                          "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400",
                                        size: 16,
                                      }),
                                      w &&
                                        (0, a.jsx)("button", {
                                          onClick: () => P(""),
                                          className:
                                            "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600",
                                          children: (0, a.jsx)(u.A, {
                                            size: 16,
                                          }),
                                        }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        }),
                        (0, a.jsx)("div", {
                          className:
                            "bg-white rounded-lg shadow overflow-hidden",
                          children: (0, a.jsxs)("table", {
                            className: "min-w-full divide-y divide-gray-200",
                            children: [
                              (0, a.jsx)("thead", {
                                className: "bg-gray-50",
                                children: (0, a.jsxs)("tr", {
                                  children: [
                                    (0, a.jsx)("th", {
                                      className:
                                        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                      children: "Name",
                                    }),
                                    (0, a.jsx)("th", {
                                      className:
                                        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                      children: "Email",
                                    }),
                                    (0, a.jsx)("th", {
                                      className:
                                        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                      children: "Status",
                                    }),
                                    (0, a.jsx)("th", {
                                      className:
                                        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                      children: "Event",
                                    }),
                                    (0, a.jsx)("th", {
                                      className:
                                        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                      children: "Guests",
                                    }),
                                    (0, a.jsx)("th", {
                                      className:
                                        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                      children: "Actions",
                                    }),
                                  ],
                                }),
                              }),
                              (0, a.jsxs)("tbody", {
                                className: "bg-white divide-y divide-gray-200",
                                children: [
                                  L &&
                                    !q?.getAllRsvps &&
                                    (0, a.jsx)("tr", {
                                      children: (0, a.jsx)("td", {
                                        className:
                                          "px-6 py-4 text-sm text-gray-500",
                                        colSpan: 6,
                                        children: (0, a.jsxs)("div", {
                                          className:
                                            "flex items-center justify-center",
                                          children: [
                                            (0, a.jsx)("div", {
                                              className:
                                                "animate-spin h-5 w-5 border-2 border-royal-600 rounded-full border-t-transparent mr-2",
                                            }),
                                            "Loading guest data...",
                                          ],
                                        }),
                                      }),
                                    }),
                                  V &&
                                    (0, a.jsx)("tr", {
                                      children: (0, a.jsx)("td", {
                                        className:
                                          "px-6 py-4 text-sm text-red-500",
                                        colSpan: 6,
                                        children:
                                          "Error loading guest data. Please try again.",
                                      }),
                                    }),
                                  !L &&
                                    !V &&
                                    (!q?.getAllRsvps ||
                                      0 === q.getAllRsvps.length) &&
                                    (0, a.jsx)("tr", {
                                      children: (0, a.jsx)("td", {
                                        className:
                                          "px-6 py-4 text-sm text-gray-500 italic",
                                        colSpan: 6,
                                        children:
                                          "No guest data available yet.",
                                      }),
                                    }),
                                  q?.getAllRsvps &&
                                    q.getAllRsvps.map((e) =>
                                      (0, a.jsxs)(
                                        "tr",
                                        {
                                          className: "hover:bg-gray-50",
                                          children: [
                                            (0, a.jsx)("td", {
                                              className:
                                                "px-6 py-4 whitespace-nowrap",
                                              children: (0, a.jsx)("div", {
                                                className:
                                                  "text-sm font-medium text-gray-900",
                                                children: e.name,
                                              }),
                                            }),
                                            (0, a.jsx)("td", {
                                              className:
                                                "px-6 py-4 whitespace-nowrap",
                                              children: (0, a.jsx)("div", {
                                                className:
                                                  "text-sm text-gray-500",
                                                children: e.email,
                                              }),
                                            }),
                                            (0, a.jsx)("td", {
                                              className:
                                                "px-6 py-4 whitespace-nowrap",
                                              children: (0, a.jsx)("span", {
                                                className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                  "attending" === e.attending
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                }`,
                                                children:
                                                  "attending" === e.attending
                                                    ? "Attending"
                                                    : "Not Attending",
                                              }),
                                            }),
                                            (0, a.jsx)("td", {
                                              className:
                                                "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                              children:
                                                e.eventParticipation ===
                                                es.S0.BOTH
                                                  ? "Both Events"
                                                  : e.eventParticipation ===
                                                    es.S0.BLESSING_ONLY
                                                  ? "Ceremony Only"
                                                  : e.eventParticipation ===
                                                    es.S0.EVENING_ONLY
                                                  ? "Reception Only"
                                                  : "None",
                                            }),
                                            (0, a.jsxs)("td", {
                                              className:
                                                "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                              children: [
                                                "single" === e.guestType
                                                  ? "1"
                                                  : "2",
                                                e.hasChildren &&
                                                  e.children &&
                                                  e.children.length > 0 &&
                                                  ` + ${e.children.length} children`,
                                              ],
                                            }),
                                            (0, a.jsxs)("td", {
                                              className:
                                                "px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2",
                                              children: [
                                                (0, a.jsx)("button", {
                                                  onClick: () => H(e),
                                                  className:
                                                    "text-royal-600 hover:text-royal-900",
                                                  children: (0, a.jsx)(h, {
                                                    size: 16,
                                                    className: "inline",
                                                  }),
                                                }),
                                                (0, a.jsx)("button", {
                                                  onClick: () => {
                                                    E(e),
                                                      D({ ...e }),
                                                      S(!0),
                                                      k(!0);
                                                  },
                                                  className:
                                                    "text-blue-600 hover:text-blue-900",
                                                  children: (0, a.jsx)(p.A, {
                                                    size: 16,
                                                    className: "inline",
                                                  }),
                                                }),
                                                (0, a.jsx)("button", {
                                                  onClick: () => {
                                                    W(e);
                                                  },
                                                  className:
                                                    "text-red-600 hover:text-red-900",
                                                  children: (0, a.jsx)(g.A, {
                                                    size: 16,
                                                    className: "inline",
                                                  }),
                                                }),
                                              ],
                                            }),
                                          ],
                                        },
                                        e.id
                                      )
                                    ),
                                ],
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                  "export" === t &&
                    (0, a.jsxs)("div", {
                      children: [
                        (0, a.jsx)("h1", {
                          className: "text-2xl font-playfair font-bold mb-6",
                          children: "Export Guest Data",
                        }),
                        (0, a.jsxs)("div", {
                          className: "bg-white p-6 rounded-lg shadow",
                          children: [
                            (0, a.jsx)("p", {
                              className: "mb-4",
                              children:
                                "Export your guest list data for use in external applications.",
                            }),
                            (0, a.jsxs)("div", {
                              className: "space-y-4",
                              children: [
                                (0, a.jsxs)("div", {
                                  children: [
                                    (0, a.jsx)("h3", {
                                      className: "font-medium mb-2",
                                      children: "Export Options",
                                    }),
                                    (0, a.jsxs)("div", {
                                      className: "flex gap-4",
                                      children: [
                                        (0, a.jsxs)("button", {
                                          onClick: () => {
                                            if (!q?.getAllRsvps) return;
                                            let e = new Blob(
                                                [
                                                  [
                                                    "Name,Email,Attending,Event,Guest Type,Partner Name,Partner Email,Children,Dietary Requirements,Notes",
                                                    ...q.getAllRsvps
                                                      .map((e) => [
                                                        e.name,
                                                        e.email,
                                                        "attending" ===
                                                        e.attending
                                                          ? "Yes"
                                                          : "No",
                                                        e.eventParticipation ===
                                                        es.S0.BOTH
                                                          ? "Both Events"
                                                          : e.eventParticipation ===
                                                            es.S0.BLESSING_ONLY
                                                          ? "Ceremony Only"
                                                          : e.eventParticipation ===
                                                            es.S0.EVENING_ONLY
                                                          ? "Reception Only"
                                                          : "None",
                                                        "couple" === e.guestType
                                                          ? "Couple"
                                                          : "Single",
                                                        e.partnerName || "",
                                                        e.partnerEmail || "",
                                                        e.hasChildren &&
                                                        e.children
                                                          ? e.children
                                                              .map(
                                                                (e) =>
                                                                  `${e.name} (${e.age})`
                                                              )
                                                              .join(", ")
                                                          : "",
                                                        e.dietaryRequirements ||
                                                          "",
                                                        e.notes || "",
                                                      ])
                                                      .map((e) =>
                                                        e
                                                          .map(
                                                            (e) =>
                                                              `"${e.replace(
                                                                /"/g,
                                                                '""'
                                                              )}"`
                                                          )
                                                          .join(",")
                                                      ),
                                                  ].join("\n"),
                                                ],
                                                {
                                                  type: "text/csv;charset=utf-8;",
                                                }
                                              ),
                                              t = URL.createObjectURL(e),
                                              s = document.createElement("a");
                                            s.setAttribute("href", t),
                                              s.setAttribute(
                                                "download",
                                                `wedding-guests-${
                                                  new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                                }.csv`
                                              ),
                                              document.body.appendChild(s),
                                              s.click(),
                                              s.parentNode?.removeChild(s),
                                              et.oR.success(
                                                "CSV file exported successfully"
                                              );
                                          },
                                          disabled:
                                            !q?.getAllRsvps ||
                                            0 === q.getAllRsvps.length,
                                          className: `px-4 py-2 rounded-md flex items-center gap-2 ${
                                            q?.getAllRsvps &&
                                            0 !== q.getAllRsvps.length
                                              ? "bg-royal-600 text-white hover:bg-royal-700"
                                              : "bg-gray-400 text-gray-200 cursor-not-allowed"
                                          }`,
                                          children: [
                                            (0, a.jsx)(v, { size: 16 }),
                                            "Export as CSV",
                                          ],
                                        }),
                                        (0, a.jsxs)("button", {
                                          disabled:
                                            !q?.getAllRsvps ||
                                            0 === q.getAllRsvps.length,
                                          className: `px-4 py-2 rounded-md flex items-center gap-2 ${
                                            q?.getAllRsvps &&
                                            0 !== q.getAllRsvps.length
                                              ? "bg-green-600 text-white hover:bg-green-700"
                                              : "bg-gray-400 text-gray-200 cursor-not-allowed"
                                          }`,
                                          children: [
                                            (0, a.jsx)(v, { size: 16 }),
                                            "Export as Excel",
                                          ],
                                        }),
                                      ],
                                    }),
                                    q?.getAllRsvps && 0 !== q.getAllRsvps.length
                                      ? (0, a.jsxs)("p", {
                                          className:
                                            "text-sm text-gray-500 mt-2",
                                          children: [
                                            q.getAllRsvps.length,
                                            " guests available for export",
                                          ],
                                        })
                                      : (0, a.jsx)("p", {
                                          className:
                                            "text-sm text-gray-500 mt-2 italic",
                                          children:
                                            "No guest data available to export",
                                        }),
                                  ],
                                }),
                                (0, a.jsxs)("div", {
                                  children: [
                                    (0, a.jsx)("h3", {
                                      className: "font-medium mb-2",
                                      children: "Email Guest List",
                                    }),
                                    (0, a.jsx)("div", {
                                      className: "flex gap-4",
                                      children: (0, a.jsxs)("button", {
                                        disabled:
                                          !q?.getAllRsvps ||
                                          0 === q.getAllRsvps.length,
                                        className: `px-4 py-2 rounded-md flex items-center gap-2 ${
                                          q?.getAllRsvps &&
                                          0 !== q.getAllRsvps.length
                                            ? "bg-royal-600 text-white hover:bg-royal-700"
                                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                                        }`,
                                        children: [
                                          (0, a.jsx)(b.A, { size: 16 }),
                                          "Email Guest List",
                                        ],
                                      }),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  R &&
                    C &&
                    (0, a.jsx)("div", {
                      className:
                        "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4",
                      children: (0, a.jsx)("div", {
                        className:
                          "bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto",
                        children: (0, a.jsxs)("div", {
                          className: "p-6",
                          children: [
                            (0, a.jsxs)("div", {
                              className:
                                "flex justify-between items-center mb-6",
                              children: [
                                (0, a.jsx)("h2", {
                                  className:
                                    "text-2xl font-playfair font-bold text-royal-600",
                                  children: A
                                    ? "Edit Guest Details"
                                    : "Guest Details",
                                }),
                                (0, a.jsx)("button", {
                                  onClick: () => S(!1),
                                  className:
                                    "text-gray-500 hover:text-gray-700",
                                  children: (0, a.jsx)(u.A, { size: 24 }),
                                }),
                              ],
                            }),
                            A
                              ? (0, a.jsxs)("div", {
                                  className: "space-y-6",
                                  children: [
                                    (0, a.jsxs)("div", {
                                      className:
                                        "grid grid-cols-1 md:grid-cols-2 gap-6",
                                      children: [
                                        (0, a.jsxs)("div", {
                                          children: [
                                            (0, a.jsx)("label", {
                                              className:
                                                "block text-sm font-medium text-gray-700 mb-1",
                                              children: "Name",
                                            }),
                                            (0, a.jsx)("input", {
                                              type: "text",
                                              value: O?.name || "",
                                              onChange: (e) =>
                                                D({
                                                  ...O,
                                                  name: e.target.value,
                                                }),
                                              className:
                                                "border rounded-md px-3 py-2 w-full",
                                            }),
                                          ],
                                        }),
                                        (0, a.jsxs)("div", {
                                          children: [
                                            (0, a.jsx)("label", {
                                              className:
                                                "block text-sm font-medium text-gray-700 mb-1",
                                              children: "Email",
                                            }),
                                            (0, a.jsx)("input", {
                                              type: "email",
                                              value: O?.email || "",
                                              onChange: (e) =>
                                                D({
                                                  ...O,
                                                  email: e.target.value,
                                                }),
                                              className:
                                                "border rounded-md px-3 py-2 w-full",
                                            }),
                                          ],
                                        }),
                                        (0, a.jsxs)("div", {
                                          children: [
                                            (0, a.jsx)("label", {
                                              className:
                                                "block text-sm font-medium text-gray-700 mb-1",
                                              children: "Attendance",
                                            }),
                                            (0, a.jsxs)("select", {
                                              value:
                                                O?.attending || "attending",
                                              onChange: (e) =>
                                                D({
                                                  ...O,
                                                  attending: e.target.value,
                                                }),
                                              className:
                                                "border rounded-md px-3 py-2 w-full",
                                              children: [
                                                (0, a.jsx)("option", {
                                                  value: "attending",
                                                  children: "Attending",
                                                }),
                                                (0, a.jsx)("option", {
                                                  value: "not_attending",
                                                  children: "Not Attending",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        (0, a.jsxs)("div", {
                                          children: [
                                            (0, a.jsx)("label", {
                                              className:
                                                "block text-sm font-medium text-gray-700 mb-1",
                                              children: "Event Participation",
                                            }),
                                            (0, a.jsxs)("select", {
                                              value:
                                                O?.eventParticipation || "both",
                                              onChange: (e) =>
                                                D({
                                                  ...O,
                                                  eventParticipation:
                                                    e.target.value,
                                                }),
                                              className:
                                                "border rounded-md px-3 py-2 w-full",
                                              disabled:
                                                O?.attending ===
                                                "not_attending",
                                              children: [
                                                (0, a.jsx)("option", {
                                                  value: "both",
                                                  children: "Both Events",
                                                }),
                                                (0, a.jsx)("option", {
                                                  value: "blessing_only",
                                                  children: "Ceremony Only",
                                                }),
                                                (0, a.jsx)("option", {
                                                  value: "evening_only",
                                                  children: "Reception Only",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        (0, a.jsxs)("div", {
                                          children: [
                                            (0, a.jsx)("label", {
                                              className:
                                                "block text-sm font-medium text-gray-700 mb-1",
                                              children: "Guest Type",
                                            }),
                                            (0, a.jsxs)("select", {
                                              value: O?.guestType || "single",
                                              onChange: (e) =>
                                                D({
                                                  ...O,
                                                  guestType: e.target.value,
                                                }),
                                              className:
                                                "border rounded-md px-3 py-2 w-full",
                                              disabled:
                                                O?.attending ===
                                                "not_attending",
                                              children: [
                                                (0, a.jsx)("option", {
                                                  value: "single",
                                                  children: "Single",
                                                }),
                                                (0, a.jsx)("option", {
                                                  value: "couple",
                                                  children: "Couple",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    O?.guestType === "couple" &&
                                      O?.attending === "attending" &&
                                      (0, a.jsxs)("div", {
                                        className: "border-t pt-4 mt-4",
                                        children: [
                                          (0, a.jsx)("h3", {
                                            className:
                                              "text-lg font-medium mb-4",
                                            children: "Partner Information",
                                          }),
                                          (0, a.jsxs)("div", {
                                            className:
                                              "grid grid-cols-1 md:grid-cols-2 gap-6",
                                            children: [
                                              (0, a.jsxs)("div", {
                                                children: [
                                                  (0, a.jsx)("label", {
                                                    className:
                                                      "block text-sm font-medium text-gray-700 mb-1",
                                                    children: "Partner Name",
                                                  }),
                                                  (0, a.jsx)("input", {
                                                    type: "text",
                                                    value: O?.partnerName || "",
                                                    onChange: (e) =>
                                                      D({
                                                        ...O,
                                                        partnerName:
                                                          e.target.value,
                                                      }),
                                                    className:
                                                      "border rounded-md px-3 py-2 w-full",
                                                  }),
                                                ],
                                              }),
                                              (0, a.jsxs)("div", {
                                                children: [
                                                  (0, a.jsx)("label", {
                                                    className:
                                                      "block text-sm font-medium text-gray-700 mb-1",
                                                    children: "Partner Email",
                                                  }),
                                                  (0, a.jsx)("input", {
                                                    type: "email",
                                                    value:
                                                      O?.partnerEmail || "",
                                                    onChange: (e) =>
                                                      D({
                                                        ...O,
                                                        partnerEmail:
                                                          e.target.value,
                                                      }),
                                                    className:
                                                      "border rounded-md px-3 py-2 w-full",
                                                  }),
                                                ],
                                              }),
                                              (0, a.jsxs)("div", {
                                                children: [
                                                  (0, a.jsx)("label", {
                                                    className:
                                                      "block text-sm font-medium text-gray-700 mb-1",
                                                    children:
                                                      "Partner Event Participation",
                                                  }),
                                                  (0, a.jsxs)("select", {
                                                    value:
                                                      O?.partnerEventParticipation ||
                                                      "both",
                                                    onChange: (e) =>
                                                      D({
                                                        ...O,
                                                        partnerEventParticipation:
                                                          e.target.value,
                                                      }),
                                                    className:
                                                      "border rounded-md px-3 py-2 w-full",
                                                    children: [
                                                      (0, a.jsx)("option", {
                                                        value: "both",
                                                        children: "Both Events",
                                                      }),
                                                      (0, a.jsx)("option", {
                                                        value: "blessing_only",
                                                        children:
                                                          "Ceremony Only",
                                                      }),
                                                      (0, a.jsx)("option", {
                                                        value: "evening_only",
                                                        children:
                                                          "Reception Only",
                                                      }),
                                                    ],
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    (0, a.jsxs)("div", {
                                      className: "border-t pt-4 mt-4",
                                      children: [
                                        (0, a.jsxs)("div", {
                                          className: "flex items-center mb-4",
                                          children: [
                                            (0, a.jsx)("h3", {
                                              className: "text-lg font-medium",
                                              children: "Children Information",
                                            }),
                                            (0, a.jsxs)("label", {
                                              className:
                                                "ml-4 inline-flex items-center",
                                              children: [
                                                (0, a.jsx)("input", {
                                                  type: "checkbox",
                                                  checked: O?.hasChildren || !1,
                                                  onChange: (e) =>
                                                    D({
                                                      ...O,
                                                      hasChildren:
                                                        e.target.checked,
                                                    }),
                                                  className: "mr-2",
                                                  disabled:
                                                    O?.attending ===
                                                    "not_attending",
                                                }),
                                                (0, a.jsx)("span", {
                                                  children: "Bringing Children",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        O?.hasChildren &&
                                          O?.attending === "attending" &&
                                          (0, a.jsxs)("div", {
                                            className: "space-y-4",
                                            children: [
                                              O?.children?.map((e, t) =>
                                                a.jsxs(
                                                  "div",
                                                  {
                                                    className:
                                                      "flex items-center gap-4",
                                                    children: [
                                                      a.jsxs("div", {
                                                        className: "flex-grow",
                                                        children: [
                                                          a.jsx("label", {
                                                            className:
                                                              "block text-sm font-medium text-gray-700 mb-1",
                                                            children:
                                                              "Child Name",
                                                          }),
                                                          a.jsx("input", {
                                                            type: "text",
                                                            value: e.name,
                                                            onChange: (e) => {
                                                              let s = [
                                                                ...(O.children ||
                                                                  []),
                                                              ];
                                                              (s[t].name =
                                                                e.target.value),
                                                                D({
                                                                  ...O,
                                                                  children: s,
                                                                });
                                                            },
                                                            className:
                                                              "border rounded-md px-3 py-2 w-full",
                                                          }),
                                                        ],
                                                      }),
                                                      a.jsxs("div", {
                                                        className: "w-24",
                                                        children: [
                                                          a.jsx("label", {
                                                            className:
                                                              "block text-sm font-medium text-gray-700 mb-1",
                                                            children: "Age",
                                                          }),
                                                          a.jsx("input", {
                                                            type: "number",
                                                            min: "0",
                                                            max: "17",
                                                            value: e.age,
                                                            onChange: (e) => {
                                                              let s = [
                                                                ...(O.children ||
                                                                  []),
                                                              ];
                                                              (s[t].age =
                                                                parseInt(
                                                                  e.target.value
                                                                )),
                                                                D({
                                                                  ...O,
                                                                  children: s,
                                                                });
                                                            },
                                                            className:
                                                              "border rounded-md px-3 py-2 w-full",
                                                          }),
                                                        ],
                                                      }),
                                                      a.jsx("button", {
                                                        type: "button",
                                                        onClick: () => {
                                                          let e = [
                                                            ...(O.children ||
                                                              []),
                                                          ];
                                                          e.splice(t, 1),
                                                            D({
                                                              ...O,
                                                              children: e,
                                                              childrenCount:
                                                                (O.childrenCount ||
                                                                  0) - 1,
                                                            });
                                                        },
                                                        className:
                                                          "bg-red-100 p-2 rounded-md text-red-600 hover:bg-red-200 mt-6",
                                                        children: a.jsx(u.A, {
                                                          size: 16,
                                                        }),
                                                      }),
                                                    ],
                                                  },
                                                  e.id || t
                                                )
                                              ),
                                              (0, a.jsx)("button", {
                                                type: "button",
                                                onClick: () => {
                                                  let e = [
                                                    ...(O.children || []),
                                                  ];
                                                  e.push({
                                                    id: `temp-${Date.now()}`,
                                                    name: "",
                                                    age: 0,
                                                  }),
                                                    D({
                                                      ...O,
                                                      children: e,
                                                      childrenCount:
                                                        (O.childrenCount || 0) +
                                                        1,
                                                    });
                                                },
                                                className:
                                                  "bg-blue-100 px-4 py-2 rounded-md text-blue-600 hover:bg-blue-200",
                                                children: "Add Child",
                                              }),
                                            ],
                                          }),
                                      ],
                                    }),
                                    (0, a.jsxs)("div", {
                                      className: "border-t pt-4 mt-4",
                                      children: [
                                        (0, a.jsx)("h3", {
                                          className: "text-lg font-medium mb-4",
                                          children: "Additional Information",
                                        }),
                                        (0, a.jsxs)("div", {
                                          className: "space-y-4",
                                          children: [
                                            (0, a.jsxs)("div", {
                                              children: [
                                                (0, a.jsx)("label", {
                                                  className:
                                                    "block text-sm font-medium text-gray-700 mb-1",
                                                  children:
                                                    "Dietary Requirements",
                                                }),
                                                (0, a.jsx)("textarea", {
                                                  value:
                                                    O?.dietaryRequirements ||
                                                    "",
                                                  onChange: (e) =>
                                                    D({
                                                      ...O,
                                                      dietaryRequirements:
                                                        e.target.value,
                                                    }),
                                                  className:
                                                    "border rounded-md px-3 py-2 w-full h-24",
                                                  disabled:
                                                    O?.attending ===
                                                    "not_attending",
                                                }),
                                              ],
                                            }),
                                            (0, a.jsxs)("div", {
                                              children: [
                                                (0, a.jsx)("label", {
                                                  className:
                                                    "block text-sm font-medium text-gray-700 mb-1",
                                                  children: "Notes",
                                                }),
                                                (0, a.jsx)("textarea", {
                                                  value: O?.notes || "",
                                                  onChange: (e) =>
                                                    D({
                                                      ...O,
                                                      notes: e.target.value,
                                                    }),
                                                  className:
                                                    "border rounded-md px-3 py-2 w-full h-24",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    (0, a.jsxs)("div", {
                                      className:
                                        "flex justify-end gap-4 mt-6 border-t pt-4",
                                      children: [
                                        (0, a.jsx)("button", {
                                          type: "button",
                                          onClick: () => S(!1),
                                          className:
                                            "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50",
                                          children: "Cancel",
                                        }),
                                        (0, a.jsx)("button", {
                                          type: "button",
                                          onClick: () => {
                                            if (!O?.id) return;
                                            let e = {
                                              name: O.name,
                                              email: O.email,
                                              attending: O.attending,
                                              guestType: O.guestType,
                                              eventParticipation:
                                                O.eventParticipation,
                                              partnerName: O.partnerName,
                                              partnerEmail: O.partnerEmail,
                                              partnerEventParticipation:
                                                O.partnerEventParticipation,
                                              hasChildren: O.hasChildren,
                                              childrenCount: O.childrenCount,
                                              children: O.children,
                                              dietaryRequirements:
                                                O.dietaryRequirements,
                                              notes: O.notes,
                                            };
                                            M({
                                              variables: { id: O.id, guest: e },
                                            });
                                          },
                                          disabled: F,
                                          className:
                                            "bg-royal-600 text-white px-4 py-2 rounded-md hover:bg-royal-700 flex items-center gap-2",
                                          children: F
                                            ? (0, a.jsxs)(a.Fragment, {
                                                children: [
                                                  (0, a.jsx)("div", {
                                                    className:
                                                      "animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent",
                                                  }),
                                                  "Saving...",
                                                ],
                                              })
                                            : (0, a.jsxs)(a.Fragment, {
                                                children: [
                                                  (0, a.jsx)(y, { size: 16 }),
                                                  "Save Changes",
                                                ],
                                              }),
                                        }),
                                      ],
                                    }),
                                  ],
                                })
                              : (0, a.jsxs)("div", {
                                  className: "space-y-6",
                                  children: [
                                    (0, a.jsxs)("div", {
                                      className:
                                        "grid grid-cols-1 md:grid-cols-2 gap-6",
                                      children: [
                                        (0, a.jsxs)("div", {
                                          children: [
                                            (0, a.jsx)("h3", {
                                              className:
                                                "text-sm font-medium text-gray-500",
                                              children: "Name",
                                            }),
                                            (0, a.jsx)("p", {
                                              className: "text-lg",
                                              children: C.name,
                                            }),
                                          ],
                                        }),
                                        (0, a.jsxs)("div", {
                                          children: [
                                            (0, a.jsx)("h3", {
                                              className:
                                                "text-sm font-medium text-gray-500",
                                              children: "Email",
                                            }),
                                            (0, a.jsx)("p", {
                                              className: "text-lg",
                                              children: C.email,
                                            }),
                                          ],
                                        }),
                                        (0, a.jsxs)("div", {
                                          children: [
                                            (0, a.jsx)("h3", {
                                              className:
                                                "text-sm font-medium text-gray-500",
                                              children: "Attendance",
                                            }),
                                            (0, a.jsx)("p", {
                                              className: `text-lg ${
                                                "attending" === C.attending
                                                  ? "text-green-600"
                                                  : "text-red-600"
                                              }`,
                                              children:
                                                "attending" === C.attending
                                                  ? "Attending"
                                                  : "Not Attending",
                                            }),
                                          ],
                                        }),
                                        (0, a.jsxs)("div", {
                                          children: [
                                            (0, a.jsx)("h3", {
                                              className:
                                                "text-sm font-medium text-gray-500",
                                              children: "Event Participation",
                                            }),
                                            (0, a.jsx)("p", {
                                              className: "text-lg",
                                              children:
                                                C.eventParticipation ===
                                                es.S0.BOTH
                                                  ? "Both Events"
                                                  : C.eventParticipation ===
                                                    es.S0.BLESSING_ONLY
                                                  ? "Ceremony Only"
                                                  : C.eventParticipation ===
                                                    es.S0.EVENING_ONLY
                                                  ? "Reception Only"
                                                  : "None",
                                            }),
                                          ],
                                        }),
                                        (0, a.jsxs)("div", {
                                          children: [
                                            (0, a.jsx)("h3", {
                                              className:
                                                "text-sm font-medium text-gray-500",
                                              children: "Guest Type",
                                            }),
                                            (0, a.jsx)("p", {
                                              className: "text-lg",
                                              children:
                                                "single" === C.guestType
                                                  ? "Single"
                                                  : "Couple",
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    "couple" === C.guestType &&
                                      (0, a.jsxs)("div", {
                                        className: "border-t pt-4 mt-4",
                                        children: [
                                          (0, a.jsx)("h3", {
                                            className:
                                              "text-lg font-medium mb-4",
                                            children: "Partner Information",
                                          }),
                                          (0, a.jsxs)("div", {
                                            className:
                                              "grid grid-cols-1 md:grid-cols-2 gap-6",
                                            children: [
                                              (0, a.jsxs)("div", {
                                                children: [
                                                  (0, a.jsx)("h3", {
                                                    className:
                                                      "text-sm font-medium text-gray-500",
                                                    children: "Partner Name",
                                                  }),
                                                  (0, a.jsx)("p", {
                                                    className: "text-lg",
                                                    children:
                                                      C.partnerName ||
                                                      "Not provided",
                                                  }),
                                                ],
                                              }),
                                              (0, a.jsxs)("div", {
                                                children: [
                                                  (0, a.jsx)("h3", {
                                                    className:
                                                      "text-sm font-medium text-gray-500",
                                                    children: "Partner Email",
                                                  }),
                                                  (0, a.jsx)("p", {
                                                    className: "text-lg",
                                                    children:
                                                      C.partnerEmail ||
                                                      "Not provided",
                                                  }),
                                                ],
                                              }),
                                              (0, a.jsxs)("div", {
                                                children: [
                                                  (0, a.jsx)("h3", {
                                                    className:
                                                      "text-sm font-medium text-gray-500",
                                                    children:
                                                      "Partner Event Participation",
                                                  }),
                                                  (0, a.jsx)("p", {
                                                    className: "text-lg",
                                                    children:
                                                      "both" ===
                                                      C.partnerEventParticipation
                                                        ? "Both Events"
                                                        : "blessing_only" ===
                                                          C.partnerEventParticipation
                                                        ? "Ceremony Only"
                                                        : C.partnerEventParticipation
                                                        ? "Reception Only"
                                                        : "Not specified",
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    C.hasChildren &&
                                      C.children &&
                                      C.children.length > 0 &&
                                      (0, a.jsxs)("div", {
                                        className: "border-t pt-4 mt-4",
                                        children: [
                                          (0, a.jsx)("h3", {
                                            className:
                                              "text-lg font-medium mb-4",
                                            children: "Children Information",
                                          }),
                                          (0, a.jsxs)("p", {
                                            className: "mb-2",
                                            children: [
                                              (0, a.jsx)("span", {
                                                className: "font-medium",
                                                children: "Number of children:",
                                              }),
                                              " ",
                                              C.children.length,
                                            ],
                                          }),
                                          (0, a.jsx)("div", {
                                            className:
                                              "bg-gray-50 p-4 rounded-lg",
                                            children: (0, a.jsxs)("table", {
                                              className: "min-w-full",
                                              children: [
                                                (0, a.jsx)("thead", {
                                                  children: (0, a.jsxs)("tr", {
                                                    children: [
                                                      (0, a.jsx)("th", {
                                                        className:
                                                          "text-left text-sm font-medium text-gray-500 pb-2",
                                                        children: "Name",
                                                      }),
                                                      (0, a.jsx)("th", {
                                                        className:
                                                          "text-left text-sm font-medium text-gray-500 pb-2",
                                                        children: "Age",
                                                      }),
                                                    ],
                                                  }),
                                                }),
                                                (0, a.jsx)("tbody", {
                                                  children: C.children.map(
                                                    (e, t) =>
                                                      (0, a.jsxs)(
                                                        "tr",
                                                        {
                                                          children: [
                                                            (0, a.jsx)("td", {
                                                              className: "py-1",
                                                              children: e.name,
                                                            }),
                                                            (0, a.jsx)("td", {
                                                              className: "py-1",
                                                              children: e.age,
                                                            }),
                                                          ],
                                                        },
                                                        e.id || t
                                                      )
                                                  ),
                                                }),
                                              ],
                                            }),
                                          }),
                                        ],
                                      }),
                                    (0, a.jsxs)("div", {
                                      className: "border-t pt-4 mt-4",
                                      children: [
                                        (0, a.jsx)("h3", {
                                          className: "text-lg font-medium mb-4",
                                          children: "Additional Information",
                                        }),
                                        (0, a.jsxs)("div", {
                                          className: "space-y-4",
                                          children: [
                                            (0, a.jsxs)("div", {
                                              children: [
                                                (0, a.jsx)("h3", {
                                                  className:
                                                    "text-sm font-medium text-gray-500",
                                                  children:
                                                    "Dietary Requirements",
                                                }),
                                                (0, a.jsx)("p", {
                                                  className:
                                                    "bg-gray-50 p-3 rounded",
                                                  children:
                                                    C.dietaryRequirements ||
                                                    "None specified",
                                                }),
                                              ],
                                            }),
                                            (0, a.jsxs)("div", {
                                              children: [
                                                (0, a.jsx)("h3", {
                                                  className:
                                                    "text-sm font-medium text-gray-500",
                                                  children: "Notes",
                                                }),
                                                (0, a.jsx)("p", {
                                                  className:
                                                    "bg-gray-50 p-3 rounded",
                                                  children: C.notes || "None",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    (0, a.jsxs)("div", {
                                      className:
                                        "flex justify-end gap-4 mt-6 border-t pt-4",
                                      children: [
                                        (0, a.jsx)("button", {
                                          type: "button",
                                          onClick: () => S(!1),
                                          className:
                                            "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50",
                                          children: "Close",
                                        }),
                                        (0, a.jsxs)("button", {
                                          type: "button",
                                          onClick: () => {
                                            k(!0), D({ ...C });
                                          },
                                          className:
                                            "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2",
                                          children: [
                                            (0, a.jsx)(p.A, { size: 16 }),
                                            "Edit",
                                          ],
                                        }),
                                        (0, a.jsx)("button", {
                                          type: "button",
                                          onClick: () => C && W(C),
                                          disabled: J,
                                          className: `${
                                            J
                                              ? "bg-red-400"
                                              : "bg-red-600 hover:bg-red-700"
                                          } text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors`,
                                          children: J
                                            ? (0, a.jsxs)(a.Fragment, {
                                                children: [
                                                  (0, a.jsx)("div", {
                                                    className:
                                                      "animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2",
                                                  }),
                                                  "Deleting...",
                                                ],
                                              })
                                            : (0, a.jsxs)(a.Fragment, {
                                                children: [
                                                  (0, a.jsx)(g.A, { size: 16 }),
                                                  "Delete",
                                                ],
                                              }),
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                          ],
                        }),
                      }),
                    }),
                ],
              }),
            ],
          });
        }
      },
      8756: (e, t, s) => {
        Promise.resolve().then(s.bind(s, 180));
      },
      9111: (e, t, s) => {
        Promise.resolve().then(s.bind(s, 4832));
      },
      9121: (e) => {
        "use strict";
        e.exports = require("next/dist/server/app-render/action-async-storage.external.js");
      },
      9294: (e) => {
        "use strict";
        e.exports = require("next/dist/server/app-render/work-async-storage.external.js");
      },
      9551: (e) => {
        "use strict";
        e.exports = require("url");
      },
    });
  var t = require("../../webpack-runtime.js");
  t.C(e);
  var s = (e) => t((t.s = e)),
    a = t.X(0, [683, 484, 429], () => s(2677));
  module.exports = a;
})();
