const stdinReadable: () => Promise<string> = () => {
  return new Promise((resolve) => {
    const stdin = process.openStdin();
    stdin.setEncoding("utf-8");

    let data = "";
    stdin.on("data", (chunk) => {
      data += chunk;
    });

    stdin.on("end", () => {
      resolve(data);
    });

    if (stdin.isTTY) {
      process.stdin.destroy();
      resolve("");
    }
  });
};

export default stdinReadable;
