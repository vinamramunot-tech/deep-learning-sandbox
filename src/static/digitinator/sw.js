if (!self.define) {
    const e = e => {
            "require" !== e && (e += ".js");
            let s = Promise.resolve();
            return n[e] || (s = new Promise((async s => {
                if ("document" in self) {
                    const n = document.createElement("script");
                    n.src = e, document.head.appendChild(n), n.onload = s
                } else importScripts(e), s()
            }))), s.then((() => {
                if (!n[e]) throw new Error(`Module ${e} didn’t register its module`);
                return n[e]
            }))
        },
        s = (s, n) => {
            Promise.all(s.map(e)).then((e => n(1 === e.length ? e[0] : e)))
        },
        n = {
            require: Promise.resolve(s)
        };
    self.define = (s, i, r) => {
        n[s] || (n[s] = Promise.resolve().then((() => {
            let n = {};
            const c = {
                uri: location.origin + s.slice(1)
            };
            return Promise.all(i.map((s => {
                switch (s) {
                    case "exports":
                        return n;
                    case "module":
                        return c;
                    default:
                        return e(s)
                }
            }))).then((e => {
                const s = r(...e);
                return n.default || (n.default = s), n
            }))
        })))
    }
}
define("./sw.js", ["./workbox-8778d57b"], (function(e) {
    "use strict";
    importScripts(), self.skipWaiting(), e.clientsClaim(), e.precacheAndRoute([{
        url: "./TQEbEhlhXHbse45sSGIdN/_buildManifest.js",
        revision: "TQEbEhlhXHbse45sSGIdN"
    }, {
        url: "./TQEbEhlhXHbse45sSGIdN/_ssgManifest.js",
        revision: "TQEbEhlhXHbse45sSGIdN"
    }, {
        url: "./chunks/31664189.f157bab729b44dfe3e8b.js",
        revision: "TQEbEhlhXHbse45sSGIdN"
    }, {
        url: "./chunks/545f34e4.b935850a9926f3c117af.js",
        revision: "TQEbEhlhXHbse45sSGIdN"
    }, {
        url: "./chunks/78e521c3.2e41d0500c761a563631.js",
        revision: "TQEbEhlhXHbse45sSGIdN"
    }, {
        url: "./chunks/commons.f98e9b6e8b7152d4434a.js",
        revision: "TQEbEhlhXHbse45sSGIdN"
    }, {
        url: "./chunks/d7eeaac4.69598c38ec4a55e5d203.js",
        revision: "TQEbEhlhXHbse45sSGIdN"
    }, {
        url: "./chunks/f6078781a05fe1bcb0902d23dbbb2662c8d200b3.08f941de93f40c841c41.js",
        revision: "TQEbEhlhXHbse45sSGIdN"
    }, {
        url: "./chunks/framework.1d36bc031662b4dc4c28.js",
        revision: "TQEbEhlhXHbse45sSGIdN"
    }, {
        url: "./chunks/main-30614a1d6d6c4de3d08f.js",
        revision: "TQEbEhlhXHbse45sSGIdN"
    }, {
        url: "./chunks/pages/_app-70a7ca09a071d2c42364.js",
        revision: "TQEbEhlhXHbse45sSGIdN"
    }, {
        url: "./chunks/pages/_error-44c3523a92e32932068d.js",
        revision: "TQEbEhlhXHbse45sSGIdN"
    }, {
        url: "./chunks/pages/index-eb0a9a04d17476b335d6.js",
        revision: "TQEbEhlhXHbse45sSGIdN"
    }, {
        url: "./chunks/polyfills-56c7bebd369733d6b640.js",
        revision: "TQEbEhlhXHbse45sSGIdN"
    }, {
        url: "./chunks/webpack-e067438c4cf4ef2ef178.js",
        revision: "TQEbEhlhXHbse45sSGIdN"
    }, {
        url: "./css/digitinator-global.css",
        revision: "TQEbEhlhXHbse45sSGIdN"
    }, {
        url: "./css/digitinator-module.css",
        revision: "TQEbEhlhXHbse45sSGIdN"
    }, {
        url: "./media/pencil.9ca605a65849cff6bd7311d99fdefe99.svg",
        revision: "TQEbEhlhXHbse45sSGIdN"
    }, {
        url: "./media/banner-image.jpg",
        revision: "9521da036a82425100870d6cb1780041"
    }, {
        url: "../favicon.ico",
        revision: "69b7eb115144604a743e84f0291ea192"
    }, {
        url: "./media/logo.svg",
        revision: "c07f5fdd509a95ddc1423324259e7728"
    }, {
        url: "./model/group1-shard1of1.bin",
        revision: "d1103e225a10bf01f8b6a640ac414f90"
    }, {
        url: "./model/model.json",
        revision: "7e1e7a32b7e06a0bfe29a6f7d5d76f6e"
    }], {
        ignoreURLParametersMatching: []
    }), e.cleanupOutdatedCaches(), e.registerRoute("/", new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [new e.ExpirationPlugin({
            maxEntries: 1,
            maxAgeSeconds: 86400,
            purgeOnQuotaError: !0
        })]
    }), "GET"), e.registerRoute(/^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i, new e.CacheFirst({
        cacheName: "google-fonts",
        plugins: [new e.ExpirationPlugin({
            maxEntries: 4,
            maxAgeSeconds: 31536e3,
            purgeOnQuotaError: !0
        })]
    }), "GET"), e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i, new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [new e.ExpirationPlugin({
            maxEntries: 4,
            maxAgeSeconds: 604800,
            purgeOnQuotaError: !0
        })]
    }), "GET"), e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i, new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [new e.ExpirationPlugin({
            maxEntries: 64,
            maxAgeSeconds: 86400,
            purgeOnQuotaError: !0
        })]
    }), "GET"), e.registerRoute(/\.(?:js)$/i, new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [new e.ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 86400,
            purgeOnQuotaError: !0
        })]
    }), "GET"), e.registerRoute(/\.(?:css|less)$/i, new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [new e.ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 86400,
            purgeOnQuotaError: !0
        })]
    }), "GET"), e.registerRoute(/\.(?:json|xml|csv)$/i, new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [new e.ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 86400,
            purgeOnQuotaError: !0
        })]
    }), "GET"), e.registerRoute(/\/api\/.*$/i, new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({
            maxEntries: 16,
            maxAgeSeconds: 86400,
            purgeOnQuotaError: !0
        })]
    }), "GET"), e.registerRoute(/.*/i, new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 86400,
            purgeOnQuotaError: !0
        })]
    }), "GET")
}));