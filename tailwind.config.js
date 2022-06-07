module.exports = {
  content: ['./public/views/*.{html,js,ejs}'],
  theme: {
    extend: {
      colors: {
        'chat-purple': '#5267DF',
        'chat-red': '#F71735',
        'chat-blue': '#011627',
        'chat-grey': '#9194A2',
        'chat-white': '#f7f7f7',
        'chat-shadow-blue': '#7286A0',
        'chat-green': '#00a110',
      },
    },
    fontFamily: {
      Poppins: ['Poppins, sens-serif'],
    },
    container: {
      center: true,
      padding: '1rem',
      screens: {
        lg: '1124px',
        xl: '1124px',
        '2xl': '1124px',
      },
    },
  },
  plugins: [],
}
