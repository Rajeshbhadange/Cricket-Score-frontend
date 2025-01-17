/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",],
    theme: {
      extend: {
        screens:{
          '300':'300px',
          '350':'350px',
          '320':'320px',
          '375':'375px',
          '524':'524px',
          '560':'560px',
          '500':'500px',
          '405':'405px',
          '450':'450px',
          '585':'585px',
          '608':'608px',
          '390':'390px',
          '425':'425px',
          '640':'640px',
          '890':'890px',
        }
      },
    },
    plugins: [],
  }
  
  