const theme = require("./bf.json");
import fluid, { extract, screens, fontSize } from "fluid-tailwind";

module.exports = {
    corePlugins: {
        container: false,
    },
    content: {
        files: [
            "./*.php",
            "./blocks/**/*.twig",
            "./blocks/**/*.php",
            "./blocks/**/*.js",
            "./blocks/**/*.css",
            "./template-parts/*.php",
            "./template-parts/*.twig",
            "./template-parts/**/*.php",
            "./template-parts/**/*.twig",
            "./templates/*.php",
            "./templates/*.twig",
            "./partials/*.php",
            "./partials/*.twig",
            "./partials/**/*.php",
            "./partials/**/*.twig",
            "./components/*.php",
            "./components/*.twig",
            "./components/**/*.php",
            "./components/**/*.twig",
        ],
        extract,
    },
    safelist: [],
    theme: {
        fontSize,
        screens: {
            sm: "36rem", //576px
            md: "48rem", //768px
            lg: "62rem", //992px
            xl: "75rem", //1200px
            "2xl": "87.5rem", //1400px
            "3xl": "100rem", //1600px
        },
        extend: {
            borderRadius: {
                corners: theme.corners,
            },
            fontFamily: {
                "kh": ["kh-teka", "sans-serif"],
                barlow: ["barlow", "sans-serif"],
                "radley": ["Radley", "serif"],
                "instrument": ["Instrument Sans", "sans-serif"],
                "instrument-condensed": ["Instrument Sans Condensed", "sans-serif"],
                "instrument-semicondensed": ["Instrument Sans SemiCondensed", "sans-serif"],
                "hanken": ["Hanken Grotesk", "sans-serif"],
                "big-shoulders": ["Big Shoulders", "sans-serif"],
                "fraunces": ["Fraunces", "serif"],
                "fraunces-soft": ["Fraunces Soft", "serif"],
                "fraunces-supersoft": ["Fraunces SuperSoft", "serif"],
            },
            colors: theme.colors,
        },
    },
    darkMode: "selector",
    plugins: [
        function ({ addVariant }) {
            addVariant("child", "& > *");
            addVariant("child-hover", "& > *:hover");
        },
        function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    'translate-z': (value) => ({
                        '--tw-translate-z': value,
                        transform: ` translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
                    }),
                },
                { values: theme('translate'), supportsNegativeValues: true }
            )
        },
        function ({ addUtilities }) {
            addUtilities({
                ".center-y": {
                    top: "50%",
                    transform: "translateY(-50%)",
                },
                ".center-x": {
                    left: "50%",
                    transform: "translateX(-50%)",
                },
                ".center-xy": {
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                },
                ".text-inherit-all": {
                    "font-size": "inherit",
                    color: "inherit",
                    "font-weight": "inherit",
                    "line-height": "inherit",
                    "letter-spacing": "inherit",
                    "font-family": "inherit",
                },
            });
        },
        fluid,
    ],
};
