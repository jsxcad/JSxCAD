window.bootstrap = async () => {
  window.location.href = 'http://167.99.163.104:3000/auth/github';
};

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    window.bootstrap();
  }
};
