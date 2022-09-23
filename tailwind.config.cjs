const colors = require("tailwindcss/colors");

const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      fontFamily: {
        'mono': ['DM Mono', 'mono']
      },
      colors: {
        gray: colors.neutral,
      },
      width: {
        600: "600px",
        900: "900px"
      },
    },
  },

  plugins: [],
};

module.exports = config;
