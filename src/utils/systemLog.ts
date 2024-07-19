class SystemLogger {
  systemError = (message: any) => {
    console.log(message);
  };

  systemInfo = (message: any, data: any) => {
    console.log(message, data);
  };

  systemWarning = (message: any) => {
    console.log(message);
  };
}

export default new SystemLogger();
